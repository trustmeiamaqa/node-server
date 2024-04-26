import { test, expect } from '@playwright/test';
import { queryNewRecord } from '../../src/utils/query_db.ts';

const apiURL = process.env.api_url;
const tutorialsURL = process.env.tutorial_url;

test.describe.serial('should be able to CRUD record', () => {
  // test data
  const title = 'tutorial 1';
  const description = 'tutorial description 1';
  const published = false;
  let newRecordID = '';

  test('should create a record successfully', async ({ request }) => {
    // create new record
    const newRecord = await request.post(`${apiURL}${tutorialsURL}`, {
      data: {
        title: title,
        description: description,
        published: published,
      },
    });
    expect(newRecord.status()).toBe(200); // response 200 OK
    const resNewRecord = await newRecord.json();
    newRecordID = resNewRecord['id']; // collect newRecordID
  });

  test('should retreive new record successfully', async ({ request }) => {
    // retrieve data to check
    const getRecordByID = await request.get(
      `${apiURL}${tutorialsURL}/${newRecordID}`
    );
    expect(getRecordByID.status()).toBe(200); // response 200 OK
    const resGetRecord = await getRecordByID.json();
    // expect response value equal to created data
    expect(resGetRecord).toMatchObject(
      expect.objectContaining({
        title: title,
        description: description,
        published: published,
      })
    );

    expect(resGetRecord['title']).toHaveLength(10);
    expect(resGetRecord['description']).toHaveLength(22);
  });

  test('ensure new record is created on DB', async () => {
    // expect query result
    const expectedRecord = {
      title: title,
      description: description,
      published: published,
    };
    // SQL query
    const recordId = newRecordID;
    const queryResult = await queryNewRecord(newRecordID);
    // console.log(queryResult);
    expect(queryResult).toEqual(expectedRecord);
  });

  test('should be updated successfully', async ({ request }) => {
    // update test data
    const updatedTitle = 'updated title 1';
    const updatedDescription = 'updated description 1';
    const updatedPublished = true;
    // PUT request
    const updateRecordByID = await request.put(
      `${apiURL}${tutorialsURL}/${newRecordID}`,
      {
        data: {
          title: updatedTitle,
          description: updatedDescription,
          published: updatedPublished,
        },
      }
    );
    expect(updateRecordByID.status()).toBe(200);
    expect(await updateRecordByID.json()).toMatchObject({
      message: 'Tutorial was updated successfully.',
    });
  });

  test('should delete new record successfully', async ({ request }) => {
    const deleteRecordByID = await request.delete(
      `${apiURL}${tutorialsURL}/${newRecordID}`
    );
    expect(deleteRecordByID.status()).toBe(200); // response 200 OK
    expect(await deleteRecordByID.json()).toMatchObject({
      message: 'Tutorial was deleted successfully!',
    });

    // ensure the record is deleted
    const getDeleteRecordByID = await request.get(
      `${apiURL}${tutorialsURL}/${newRecordID}`
    );
    expect(getDeleteRecordByID.status()).toBe(404); // response 200 OK
    expect(await getDeleteRecordByID.json()).toMatchObject({
      message: `Cannot find Tutorial with id=${newRecordID}.`,
    });
  });
});

test.describe('Invalid cases', () => {
  // test data
  const title = 'invalid 999';
  const description = 'invalid description 999';
  const published = false;

  // end
  test('should not create a record without mandatory fields = title', async ({
    request,
  }) => {
    const newRecord = await request.post(`${apiURL}${tutorialsURL}`, {
      data: {
        description: description,
        published: published,
      },
    });
    expect(newRecord.status()).toBe(400);
    expect(await newRecord.json()).toMatchObject({
      message: 'Content can not be empty!',
    });
  });

  test('should create a record when description is an optional field', async ({
    request,
  }) => {
    const newRecord = await request.post(`${apiURL}${tutorialsURL}`, {
      data: {
        title: title,
        published: published,
      },
    });
    expect(newRecord.status()).toBe(200);
  });

  test('should create a record with default value of published = false', async ({
    request,
  }) => {
    const newRecord = await request.post(`${apiURL}${tutorialsURL}`, {
      data: {
        title: title,
        description: description,
      },
    });
    expect(newRecord.status()).toBe(200);
    const resNewRecord = await newRecord.json();
    const newRecordID = resNewRecord['id']; // collect newRecordID
    // retrieve data to check
    const getRecordByID = await request.get(
      `${apiURL}${tutorialsURL}/${newRecordID}`
    );
    expect(getRecordByID.status()).toBe(200); // response 200 OK
    const resGetRecord = await getRecordByID.json();
    expect(resGetRecord['published']).toBe(false);
  });
});
