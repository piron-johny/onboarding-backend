import { userTable } from '@/tables';
import { User } from '@/types/user';
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
  async getUserById(id: string) {
    const params: GetCommandInput = {
      TableName: userTable.Properties.TableName,
      Key: { id },
    };
    try {
      return (await this.dbClient.send(new GetCommand(params))).Item as User;
    } catch (error) {
      console.error('ERROR DB GET USER :', error);
      console.log('PARAMS : ', params);
      throw new Error('Get user error');
    }
  }

  async findUserByName(name: string): Promise<User[]> {
    const params: ScanCommandInput = {
      TableName: userTable.Properties.TableName,
      FilterExpression: '#name = :nameValue',
      ExpressionAttributeNames: {
        '#name': 'name',
      },
      ExpressionAttributeValues: {
        ':nameValue': name,
      },
    };

    try {
      const result = await this.dbClient.send(new ScanCommand(params));
      return result.Items as User[];
    } catch (error) {
      console.error('ERROR DB FIND USER BY NAME:', error);
      console.log('PARAMS : ', params);
      throw new Error('Find user by name error.');
    }
  }

  async getAllUsers(params: ScanCommandInput) {
    try {
      return (await this.dbClient.send(new ScanCommand(params)))
        .Items as User[];
    } catch (error) {
      console.error('ERROR DB GET_ALL USERS :', error);
      console.log('PARAMS : ', params);
      throw new Error('Get user error');
    }
  }
}

export const dynamoDbService = new DynamoDbService(dynamoDbDocClient);
