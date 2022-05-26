import { userFromDatabase } from "../src/userPetsTestData";
import { test, expect } from "@playwright/test";

test.describe("Pets page", () => {
  test("should be able to edit all fields for pets", async ({ page }) => {
    await page.goto("localhost:3000/pets");

    const topValues = {
      name: "Jane",
      password: "abcd",
    };

    const pet1 = {
      name: "Gamma",
      age: "2",
    };

    // Top level
    await page.locator('//input[@name="name"]').fill(topValues.name);
    await page.locator('//input[@name="password"]').fill(topValues.password);

    // Pet 1
    await page.locator('//input[@name="pets.0.name"]').fill(pet1.name);
    await page.locator('//input[@name="pets.0.age"]').fill(pet1.age);

    // Photo album
    await page.locator('//input[@name="photoAlbum.public"]').click();

    await page.locator('//button[@type="submit"]').click();

    let expectedForm = JSON.parse(JSON.stringify(userFromDatabase));

    expectedForm = {
      ...expectedForm,
      ...topValues,
    };

    expectedForm.pets[0].name = pet1.name;
    expectedForm.pets[0].age = pet1.age;

    expectedForm.photoAlbum.public = true;

    expect(await page.locator("#result").innerHTML()).toBe(
      JSON.stringify(expectedForm)
    );
  });

  test("Should return original object if nothing changes", async ({ page }) => {
    await page.goto("localhost:3000/pets");

    await page.locator('//button[@type="submit"]').click();

    expect(await page.locator("#result").innerHTML()).toBe(
      JSON.stringify(userFromDatabase)
    );
  });
});
