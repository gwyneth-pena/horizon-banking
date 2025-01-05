import {
  AngularNodeAppEngine,
  createNodeRequestHandler,
  isMainModule,
  writeResponseToNodeResponse,
} from '@angular/ssr/node';
import express from 'express';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { environment } from './environments/environment';
import {
  Configuration,
  CountryCode,
  PlaidApi,
  PlaidEnvironments,
  ProcessorTokenCreateRequest,
  ProcessorTokenCreateRequestProcessorEnum,
  Products,
} from 'plaid';

const serverDistFolder = dirname(fileURLToPath(import.meta.url));
const browserDistFolder = resolve(serverDistFolder, '../browser');
const bodyParser = require('body-parser');
const { Client } = require('dwolla-v2');

const plaidConfiguration = new Configuration({
  basePath: PlaidEnvironments['sandbox'],
  baseOptions: {
    headers: {
      'PLAID-CLIENT-ID': environment.plaidClientId,
      'PLAID-SECRET': environment.plaidSecret,
    },
  },
});


const plaidClient = new PlaidApi(plaidConfiguration);
const cors = require('cors');

const app = express();
const angularApp = new AngularNodeAppEngine();
app.use(cors());
app.use(bodyParser.json());

/**
 * Example Express Rest API endpoints can be defined here.
 * Uncomment and define endpoints as necessary.
 *
 * Example:
 * ```ts
 * app.get('/api/**', (req, res) => {
 *   // Handle API request
 * });
 * ```
 */

const getEnvironment = (): 'production' | 'sandbox' => {
  const env = environment.dwollaEnv as string;

  switch (env) {
    case 'sandbox':
      return 'sandbox';
    case 'production':
      return 'production';
    default:
      throw new Error(
        'Dwolla environment should either be set to `sandbox` or `production`'
      );
  }
};

const dwollaClient = new Client({
  environment: getEnvironment(),
  key: environment.dwollaKey as string,
  secret: environment.dwollaSecret as string,
});

// Create a Dwolla Funding Source using a Plaid Processor Token
export const createFundingSource = async (options: any) => {
  try {
    return await dwollaClient
      .post(`customers/${options.customerId}/funding-sources`, {
        name: options.fundingSourceName,
        plaidToken: options.plaidToken,
      })
      .then((res: any) => res.headers.get('location'));
  } catch (err) {
    console.error('Creating a Funding Source Failed: ', err);
  }
};

export const createOnDemandAuthorization = async () => {
  try {
    const onDemandAuthorization = await dwollaClient.post(
      'on-demand-authorizations'
    );
    const authLink = onDemandAuthorization.body._links;
    return authLink;
  } catch (err) {
    console.error('Creating an On Demand Authorization Failed: ', err);
  }
};

export const createDwollaCustomer = async (newCustomer: any) => {
  try {
    return await dwollaClient
      .post('customers', newCustomer)
      .then((res: any) => res.headers.get('location'));
  } catch (err: any) {
    console.error('Creating a Dwolla Customer Failed: ', err);
  }
};

export const createTransfer = async ({
  sourceFundingSourceUrl,
  destinationFundingSourceUrl,
  amount,
}: any) => {
  try {
    const requestBody = {
      _links: {
        source: {
          href: sourceFundingSourceUrl,
        },
        destination: {
          href: destinationFundingSourceUrl,
        },
      },
      amount: {
        currency: 'USD',
        value: amount,
      },
    };
    return await dwollaClient
      .post('transfers', requestBody)
      .then((res: any) => res.headers.get('location'));
  } catch (err) {
    console.error('Transfer fund failed: ', err);
  }
};

export const addFundingSource = async ({
  dwollaCustomerId,
  processorToken,
  bankName,
}: any) => {
  try {
    // create dwolla auth link
    const dwollaAuthLinks = await createOnDemandAuthorization();

    // add funding source to the dwolla customer & get the funding source url
    const fundingSourceOptions = {
      customerId: dwollaCustomerId,
      fundingSourceName: bankName,
      plaidToken: processorToken,
      _links: dwollaAuthLinks,
    };
    return await createFundingSource(fundingSourceOptions);
  } catch (err) {
    console.error('Transfer fund failed: ', err);
  }
};

const getInstitution = async (institutionId: any) => {
  try {
    const institutionResponse = await plaidClient.institutionsGetById({
      institution_id: institutionId as string,
      country_codes: ['US'] as CountryCode[],
    });
    const intitution = institutionResponse.data.institution;

    return intitution;
  } catch (error) {
    console.error('An error occurred while getting the accounts:', error);
    return null;
  }
};

app.post('/api/create-plaid-link-token', async (req, res) => {
  const { $id, name } = req.body;
  try {
    const tokenParams = {
      user: {
        client_user_id: $id,
      },
      client_name: `${name}`,
      products: ['transactions','auth','identity'] as Products[],
      language: 'en',
      country_codes: ['US'] as CountryCode[],
    };

    const response = await plaidClient.linkTokenCreate(tokenParams);

    res.status(200).json({ token: response.data.link_token });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Token generation failed.' });
  }
});

app.post('/api/exchange-public-token', async (req, res) => {
  const { publicToken, user } = req.body;
  try {
    const response = await plaidClient.itemPublicTokenExchange({
      public_token: publicToken,
    });
    const accessToken = response.data.access_token;
    const itemId = response.data.item_id;
    const accountResponse = await plaidClient.accountsGet({
      access_token: accessToken,
    });
    const accountData = accountResponse.data.accounts[0];

    const processorTokenRequest: ProcessorTokenCreateRequest = {
      access_token: accessToken,
      account_id: accountData.account_id,
      processor: 'dwolla' as ProcessorTokenCreateRequestProcessorEnum,
    };

    const proccesorTokenResponse = await plaidClient.processorTokenCreate(
      processorTokenRequest
    );
    const processorToken = proccesorTokenResponse.data.processor_token;

    const fundingSourceUrl = await addFundingSource({
      dwollaCustomerId: user.dwollaCustomerId,
      processorToken,
      bankName: accountData.name,
    });

    if (!fundingSourceUrl) throw Error;

    const bankAccount = {
      userId: await user.$id,
      bankId: itemId,
      accountId: accountData.account_id,
      accessToken,
      fundingSourceUrl,
      shareableId: btoa(accountData.account_id),
    };

    res.status(200).json({ status: 'completed', bankAccountData: bankAccount });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Token generation failed.' });
  }
});

app.get('/api/accounts', async (req, res) => {
  try {
    const token: any = req.query['bankToken'] || '';
    const accountsResponse = await plaidClient.accountsGet({
      access_token: token,
    });

    const accountData = accountsResponse.data.accounts[0];
    const institution = await getInstitution(
      accountsResponse.data.item.institution_id!
    );

    const account = {
      id: accountData.account_id,
      availableBalance: accountData.balances.available!,
      currentBalance: accountData.balances.current!,
      institutionId: institution?.institution_id,
      name: accountData.name,
      officialName: accountData.official_name,
      mask: accountData.mask!,
      type: accountData.type as string,
      subtype: accountData.subtype! as string,
    };
    res.status(200).json({ account });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Something went wrong.' });
  }
});

app.get('/api/transactions', async (req, res) => {
  try {
    const token: any = req.query['bankToken'] || '';
    const response = await plaidClient.transactionsSync({
      access_token: token,
    });
    let hasMore = true;
    let transactions: any = [];

    const data = response.data;

    transactions = response.data.added.map((transaction) => ({
      id: transaction.transaction_id,
      name: transaction.name,
      paymentChannel: transaction.payment_channel,
      type: transaction.payment_channel,
      accountId: transaction.account_id,
      amount: transaction.amount,
      pending: transaction.pending,
      category: transaction.category ? transaction.category[0] : '',
      date: transaction.date,
      image: transaction.logo_url,
      hasMore: data.has_more
    }));

    hasMore = data.has_more;

    res.status(200).json({ transactions});
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Something went wrong.' });
  }
});

app.post('/api/dwolla-token', async (req, res) => {
  try {
    const formData = new URLSearchParams();
    formData.append('client_id', environment.dwollaKey);
    formData.append('client_secret', environment.dwollaSecret);
    formData.append('grant_type', 'client_credentials');

    const response = await fetch('https://api-sandbox.dwolla.com/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: formData.toString(),
    });
    res.status(200).json(await response.json());
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Token generation failed.' });
  }
});

app.post('/api/create-transfer', async (req, res) => {
  const { sourceFundingSourceUrl, destinationFundingSourceUrl, amount } =
    req.body;

  try {
    const requestBody = {
      _links: {
        source: {
          href: sourceFundingSourceUrl,
        },
        destination: {
          href: destinationFundingSourceUrl,
        },
      },
      amount: {
        currency: 'USD',
        value: amount,
      },
    };
    const response = await dwollaClient.post('transfers', requestBody);
    const responseLocation = response.headers.get('location');
    res.status(200).json({ data: responseLocation });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Something went wrong.' });
  }
});

app.post('/api/dwolla-customer', async (req, res) => {
  try {
    const { access_token, user } = req.body;
    const response = await fetch('https://api-sandbox.dwolla.com/customers', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/vnd.dwolla.v1.hal+json',
        Accept: 'application/vnd.dwolla.v1.hal+json',
        Authorization: `Bearer ${access_token}`,
      },
      body: JSON.stringify(user),
    });
    const responseLocation = response.headers.get('location')?.split('/');
    const id = responseLocation?.[responseLocation?.length - 1] || undefined;
    res.status(200).json({ customer_id: id });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Something went wrong.' });
  }
});

/**
 * Serve static files from /browser
 */
app.use(
  express.static(browserDistFolder, {
    maxAge: '1y',
    index: false,
    redirect: false,
  })
);

/**
 * Handle all other requests by rendering the Angular application.
 */
app.use('/**', (req, res, next) => {
  angularApp
    .handle(req)
    .then((response) =>
      response ? writeResponseToNodeResponse(response, res) : next()
    )
    .catch(next);
});

/**
 * Start the server if this module is the main entry point.
 * The server listens on the port defined by the `PORT` environment variable, or defaults to 4000.
 */
if (isMainModule(import.meta.url)) {
  const port = process.env['PORT'] || 4000;
  app.listen(port, () => {
    console.log(`Node Express server listening on http://localhost:${port}`);
  });
}

/**
 * The request handler used by the Angular CLI (dev-server and during build).
 */
export const reqHandler = createNodeRequestHandler(app);
