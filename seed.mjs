import { createClient } from '@supabase/supabase-js';
import { faker } from '@faker-js/faker';
import 'dotenv/config';
import { startOfMonth } from 'date-fns';

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_PRIVATE_KEY, {
  auth: { persistSession: false },
});
const categories = ['Food', 'Housing', 'Car', 'Entertainment'];

const {
  data: { users },
} = await supabase.auth.admin.listUsers();
const userIds = users.map(user => user.id);

const createTransaction = (transactions, userId, date) => {
  let type, category;
  const typeBias = Math.random();

  if (typeBias < 0.85) {
    type = 'Expense';
    category = faker.helpers.arrayElement(categories); // Category only for 'Expense'
  } else if (typeBias < 0.95) {
    type = 'Income';
  } else {
    type = faker.helpers.arrayElement(['Saving', 'Investment']);
  }

  let amount;
  switch (type) {
    case 'Income':
      amount = faker.number.int({ min: 2000, max: 5000 });
      break;
    case 'Expense':
      amount = faker.number.int({ min: 100, max: 1000 });
      break;
    case 'Saving':
    case 'Investment':
      amount = faker.number.int({ min: 5000, max: 10000 });
      break;
    default:
      amount = 0;
  }

  transactions.push({
    created_at: date,
    amount,
    type,
    description: faker.lorem.sentence(),
    category: type === 'Expense' ? category : null,
    user_id: userId,
  });
};

async function seedTransactions() {
  // Delete existing data
  const { error: deleteError } = await supabase.from('transactions').delete().gte('id', 0);

  if (deleteError) {
    console.error('Error deleting existing data:', deleteError);
    return;
  }

  let transactions = [];

  for (const userId of userIds) {
    for (let i = 0; i < 50; i++) {
      const date = new Date(
        faker.date.between({ from: `2024-01-01T00:00:00.000Z`, to: new Date().toISOString() }),
      );

      createTransaction(transactions, userId, date);
    }

    createTransaction(
      transactions,
      userId,
      faker.date.between({ from: startOfMonth(new Date()), to: new Date().toISOString() }),
    );
    createTransaction(
      transactions,
      userId,
      faker.date.between({ from: startOfMonth(new Date()), to: new Date().toISOString() }),
    );
    createTransaction(
      transactions,
      userId,
      faker.date.between({ from: startOfMonth(new Date()), to: new Date().toISOString() }),
    );

    createTransaction(transactions, userId, new Date());
    createTransaction(transactions, userId, new Date());
    createTransaction(transactions, userId, new Date());
  }

  const { error: insertError } = await supabase.from('transactions').upsert(transactions);

  if (insertError) {
    console.error('Error inserting data:', insertError);
  } else {
    console.log('Data inserted successfully.');
  }
}

seedTransactions().catch(console.error);
