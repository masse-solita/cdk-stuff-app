const AWS = require('aws-sdk');
const db = new AWS.DynamoDB.DocumentClient();
const TABLE_NAME = process.env.TABLE || '';
const PRIMARY_KEY = process.env.PRIMARY_KEY || '';

export const handler = async (event: any = {}, context: any): Promise<any> => {
    if (!event.body) {
        return { statusCode: 400, body: 'Missing body' };
    }
    const item = typeof event.body == 'object' ? event.body : JSON.parse(event.body);
    item[PRIMARY_KEY] = context.awsRequestId;
    const params = {
        TableName: TABLE_NAME,
        Item: item
    };
    try {
        await db.put(params).promise();
        return { statusCode: 201, body: '' };
    } catch (dbError) {
        console.log(dbError);
        return { statusCode: 500, body: 'Error' };
    }
};