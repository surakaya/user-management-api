import {expect, test } from 'vitest';
import { createUserSchema } from './user.schema';

test('başarılı kullanıcı girişi', () => {    
    // arrange (oluştur)
    const user = { 
    name: "Deniz Bakar",
    email: "deniz@gmail.com",
    age: 30
    }

    // act (eylem) - safeParse ile
    const result = createUserSchema.safeParse(user);

    // assert (doğrula)
    expect(result.success).toBe(true);
});

test('hatalı kullanıcı girişi', () => {    
    // arrange (oluştur)
    const user = { 
    name: "Deniz Bakar",
    email: "jdfcvhfuhshdfueh2h",
    age: 30
    }

    // act (eylem) - safeParse ile
    const result = createUserSchema.safeParse(user);

    // assert (doğrula)
    expect(result.success).toBe(false);
});
