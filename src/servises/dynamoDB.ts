import { DynamoDBClient, DynamoDBClientConfig } from '@aws-sdk/client-dynamodb';
import {
  DynamoDBDocumentClient,
  PutCommandInput,
  PutCommand,
  GetCommandInput,
  GetCommand,
  ScanCommandInput,
  ScanCommand,
} from '@aws-sdk/lib-dynamodb';

const dbConfig: DynamoDBClientConfig = { region: 'us-east-1' };

const client = new DynamoDBClient(dbConfig);
const dynamoDbDocClient = DynamoDBDocumentClient.from(client);

class DynamoDbService {
  constructor(private dbClient: DynamoDBDocumentClient) {}

  async createUser(params: PutCommandInput) {
    try {
      return await this.dbClient.send(new PutCommand(params));
    } catch (error) {
      console.error('ERROR DB CREATE USER :', error);
      console.log('PARAMS : ', params);
      throw new Error('Create user error.');
    }
  }

  async getUser(params: GetCommandInput) {
    try {
      return await this.dbClient.send(new GetCommand(params));
    } catch (error) {
      console.error('ERROR DB GET USER :', error);
      console.log('PARAMS : ', params);
      throw new Error('Get user error');
    }
  }

  async getAllUsers(params: ScanCommandInput) {
    try {
      return await this.dbClient.send(new ScanCommand(params));
    } catch (error) {
      console.error('ERROR DB GET_ALL USERS :', error);
      console.log('PARAMS : ', params);
      throw new Error('Get user error');
    }
  }
}

export const dynamoDbService = new DynamoDbService(dynamoDbDocClient);
