/**
 * Integration Tests for User Database Operations
 * 
 * These tests verify the integration between the application and the database
 * for user-related CRUD operations. They test the actual database interactions
 * using a test database instance.
 */

import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { db } from "./test-db";
import { users } from "@/server/db/schema/users";
import { eq } from 'drizzle-orm';

describe('User Database Integration Tests', () => {
    let testUserId: string;

    const testUser = {
        name: "Test User",
        email: "test@example.com",
        role: "user",
        emailVerified: null,
        image: null
    };

    beforeAll(async () => {
        testUserId = "0";
        // Initial cleanup
        await db.delete(users).where(eq(users.id, testUserId));
    });

    afterAll(async () => {
        // Cleanup: Delete test user if it exists
        await db.delete(users).where(eq(users.id, testUserId));
    });

    it('should successfully insert a new user into the database', async () => {
        const newUser = await db.insert(users).values({
            id: testUserId,
            ...testUser,
        }).returning();

        expect(newUser[0]).toBeDefined();
        if (!newUser[0]) throw new Error('User creation failed');
        expect(newUser[0].email).toBe(testUser.email);
        expect(newUser[0].name).toBe(testUser.name);
        expect(newUser[0].role).toBe(testUser.role);
    });

    it('should successfully retrieve an existing user from the database', async () => {
        const foundUser = await db.query.users.findFirst({
            where: eq(users.id, testUserId),
        });

        expect(foundUser).toBeDefined();
        expect(foundUser?.email).toBe(testUser.email);
        expect(foundUser?.name).toBe(testUser.name);
        expect(foundUser?.role).toBe(testUser.role);
    });

    it('should successfully update a user role in the database', async () => {
        const updatedUser = await db
            .update(users)
            .set({ role: 'worker' })
            .where(eq(users.id, testUserId))
            .returning();

        expect(updatedUser[0]).toBeDefined();
        if (!updatedUser[0]) throw new Error('User update failed');
        expect(updatedUser[0].role).toBe('worker');
    });

    it('should successfully remove a user from the database', async () => {
        const deletedUser = await db
            .delete(users)
            .where(eq(users.id, testUserId))
            .returning();

        expect(deletedUser[0]).toBeDefined();
        if (!deletedUser[0]) throw new Error('User deletion failed');
        expect(deletedUser[0].id).toBe(testUserId);

        const foundUser = await db.query.users.findFirst({
            where: eq(users.id, testUserId),
        });

        expect(foundUser).toBeUndefined();
    });
}); 