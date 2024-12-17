import { Injectable } from '@angular/core';
import { Account, Client, Databases, ID } from 'appwrite';
import { environment } from '../../../environments/environment';


@Injectable({
  providedIn: 'root',
})
export class AppWriteService {
  private client!: Client;
  private account!: Account;
  private databases!: Databases;
  private appWriteEndpoint: string = environment.appwriteEndpoint;
  private appWriteProjectId: string = environment.appwriteProjectId;

  constructor() {
    this.client = new Client();
    this.account = new Account(this.client);
    this.client
      .setEndpoint(this.appWriteEndpoint)
      .setProject(this.appWriteProjectId);
    this.databases = new Databases(this.client);
  }

  async signUp(email: string, password: string, name: string):Promise<any> {
    const user = await this.account.create(ID.unique(), email, password, name);
    return user;
  }

  async signOut() {
    await this.account.deleteSession('current');
  }

  createDocument(databaseId: string, collectionId: string, data: any):any {
    return this.databases.createDocument(
      databaseId,
      collectionId,
      ID.unique(),
      data
    );
  }

  login(email: string, password: string):any {
    return this.account.createEmailPasswordSession(email, password);
  }

  async getCurrentUser() {
    try {
      const user = await this.account.get();
      return user;
    } catch (error) {
      return null; 
    }
  }
}
