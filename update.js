import * as dynamoDbLib from './libs/dynamodb-lib';
import { success, failure } from './libs/response-lib';

export async function main(event, context) {
  const data = JSON.parse(event.body);
  const params = {
    TableName: process.env.tableName,
    Key: {
      userId: event.requestContext.identity.cognitoIdentityId,
      noteId: event.pathParameters.id
    },
    UpdateExpression:
      'SET title = :title, content = :content, attachment = :attachment, tags = :tags',
    ExpressionAttributeValues: {
      ':title': data.title != '' ? data.title : null,
      ':attachment': data.attachment || null,
      ':content': data.content || null,
      ':tags': data.tags || null
    },
    ReturnValues: 'ALL_NEW'
  };

  try {
    await dynamoDbLib.call('update', params);
    return success({ status: true });
  } catch (e) {
    return failure({ status: false });
  }
}
