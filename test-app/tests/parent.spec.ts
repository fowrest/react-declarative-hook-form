import { parentObject } from "../src/parentTestData";
import { test, expect } from "@playwright/test";

test.describe("Parent page", () => {
  test("should be able to edit all fields", async ({ page }) => {
    await page.goto("localhost:3000/parent");

    const topValues = {
      name: "Jane",
      lastName: "Dobe",
    };

    const kid1 = {
      name: "Ed",
      height: "160",
      weight: "60",
    };

    const kid2 = {
      name: "Trudy",
      height: "150",
      weight: "50",
    };

    const phoneNumbers = [{ number: "123-456" }, { number: "098-876" }];

    // Top level
    await page.locator('//input[@name="name"]').fill(topValues.name);
    await page.locator('//input[@name="lastName"]').fill(topValues.lastName);

    // Kid 1
    await page.locator('//input[@name="kids.data.0.name"]').fill(kid1.name);
    await page
      .locator('//input[@name="kids.data.0.measurement.height"]')
      .fill(kid1.height);
    await page
      .locator('//input[@name="kids.data.0.measurement.weight"]')
      .fill(kid1.weight);

    // Kid 2
    await page.locator('//input[@name="kids.data.1.name"]').fill(kid2.name);
    await page
      .locator('//input[@name="kids.data.1.measurement.height"]')
      .fill(kid2.height);
    await page
      .locator('//input[@name="kids.data.1.measurement.weight"]')
      .fill(kid2.weight);

    // Phone number
    await page
      .locator('//input[@name="phoneNumbers.0.number"]')
      .fill(phoneNumbers[0].number);
    await page
      .locator('//input[@name="phoneNumbers.1.number"]')
      .fill(phoneNumbers[1].number);

    await page.locator('//button[@type="submit"]').click();

    let expectedForm = JSON.parse(JSON.stringify(parentObject));

    expectedForm = {
      ...expectedForm,
      ...topValues,
      phoneNumbers: phoneNumbers,
    };

    expectedForm.kids.data[0].name = kid1.name;
    expectedForm.kids.data[0].measurement.height = kid1.height;
    expectedForm.kids.data[0].measurement.weight = kid1.weight;

    expectedForm.kids.data[1].name = kid2.name;
    expectedForm.kids.data[1].measurement.height = kid2.height;
    expectedForm.kids.data[1].measurement.weight = kid2.weight;

    expect(await page.locator("#result").innerHTML()).toBe(
      JSON.stringify(expectedForm)
    );
  });

  test("should be able to add more data to arrays", async ({ page }) => {
    await page.goto("localhost:3000/parent");

    const kid3 = {
      name: "Trudy",
      height: "100",
      weight: "40",
    };

    const newFriend = "new kid";

    // First friend plus button
    await page.locator("id=kids.data.0.friends-add").click();

    await page
      .locator('//input[@name="kids.data.0.friends.1.friend"]')
      .fill(newFriend);

    // New kid
    await page.locator("id=kids.data-add").click();

    // Kid 3
    await page.locator('//input[@name="kids.data.2.name"]').fill(kid3.name);
    await page
      .locator('//input[@name="kids.data.2.measurement.height"]')
      .fill(kid3.height);
    await page
      .locator('//input[@name="kids.data.2.measurement.weight"]')
      .fill(kid3.weight);

    await page.locator('//button[@type="submit"]').click();

    let expectedForm = JSON.parse(JSON.stringify(parentObject));

    expectedForm.kids.data[0].friends.push({ friend: newFriend });
    expectedForm.kids.data[2] = {
      name: kid3.name,
      measurement: {
        height: kid3.height,
        weight: kid3.weight,
      },
      friends: [{ friend: "" }], // TODO: How to deal with this case?
    };

    expect(await page.locator("#result").innerHTML()).toBe(
      JSON.stringify(expectedForm)
    );
  });

  test("should be able to remove data from form", async ({ page }) => {
    await page.goto("localhost:3000/parent");

    await page.locator("id=kids.data-0-close").click();

    await page.locator('//button[@type="submit"]').click();

    let expectedForm = JSON.parse(JSON.stringify(parentObject));
    expectedForm.kids.data.splice(0, 1);

    expect(await page.locator("#result").innerHTML()).toBe(
      JSON.stringify(expectedForm)
    );
  });

  test("should be able to remove data that was user added", async ({
    page,
  }) => {
    await page.goto("localhost:3000/parent");

    await page.locator("id=kids.data.0.friends-add").click();
    await page.locator("id=kids.data.0.friends-add").click();
    await page.locator("id=kids.data.0.friends-add").click();

    await page.locator("id=kids.data.0.friends-2-close").click();
    await page.locator("id=kids.data.0.friends-2-close").click();

    await page.locator('//button[@type="submit"]').click();

    let expectedForm = JSON.parse(JSON.stringify(parentObject));
    expectedForm.kids.data[0].friends.push({ friend: "" });

    expect(await page.locator("#result").innerHTML()).toBe(
      JSON.stringify(expectedForm)
    );
  });
});
