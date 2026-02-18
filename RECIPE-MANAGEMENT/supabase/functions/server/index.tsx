import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import { createClient } from "npm:@supabase/supabase-js@2";
import * as kv from "./kv_store.tsx";

const app = new Hono();

// Initialize Supabase client
const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? '';
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';
const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Enable logger
app.use('*', logger(console.log));

// Enable CORS for all routes and methods
app.use(
  "/*",
  cors({
    origin: "*",
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
  }),
);

// Health check endpoint
app.get("/make-server-b5d49619/health", (c) => {
  return c.json({ status: "ok" });
});

// Sign up endpoint
app.post("/make-server-b5d49619/auth/signup", async (c) => {
  try {
    const { email, password, name } = await c.req.json();
    
    const { data, error } = await supabase.auth.admin.createUser({
      email,
      password,
      user_metadata: { name },
      // Automatically confirm the user's email since an email server hasn't been configured.
      email_confirm: true
    });

    if (error) {
      console.error('Sign up error:', error);
      return c.json({ error: error.message }, 400);
    }

    return c.json({ user: data.user });
  } catch (error) {
    console.error('Sign up exception:', error);
    return c.json({ error: 'Failed to create user' }, 500);
  }
});

// Get all restaurants endpoint
app.get("/make-server-b5d49619/restaurants", async (c) => {
  try {
    const restaurants = await kv.getByPrefix('restaurant:');
    return c.json({ restaurants });
  } catch (error) {
    console.error('Get restaurants error:', error);
    return c.json({ error: 'Failed to fetch restaurants' }, 500);
  }
});

// Initialize restaurant data endpoint (for first-time setup)
app.post("/make-server-b5d49619/restaurants/init", async (c) => {
  try {
    const sampleRestaurants = [
      {
        id: 'r1',
        name: 'Bella Italia',
        cuisine: 'Italian',
        rating: 4.8,
        waitTime: 25,
        prepTime: 35,
        image: 'https://images.unsplash.com/photo-1514933651103-005eec06c04b',
        description: 'Authentic Italian cuisine with homemade pasta',
        isOpen: true
      },
      {
        id: 'r2',
        name: 'Tokyo Sushi Bar',
        cuisine: 'Japanese',
        rating: 4.9,
        waitTime: 15,
        prepTime: 20,
        image: 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351',
        description: 'Fresh sushi and traditional Japanese dishes',
        isOpen: true
      },
      {
        id: 'r3',
        name: 'Spice Route',
        cuisine: 'Indian',
        rating: 4.6,
        waitTime: 30,
        prepTime: 40,
        image: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe',
        description: 'Flavorful Indian curries and tandoori specialties',
        isOpen: true
      },
      {
        id: 'r4',
        name: 'Le Petit Bistro',
        cuisine: 'French',
        rating: 4.7,
        waitTime: 35,
        prepTime: 45,
        image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4',
        description: 'Classic French bistro with seasonal menu',
        isOpen: false
      },
      {
        id: 'r5',
        name: 'Dragon Wok',
        cuisine: 'Chinese',
        rating: 4.5,
        waitTime: 20,
        prepTime: 25,
        image: 'https://images.unsplash.com/photo-1585032226651-759b368d7246',
        description: 'Authentic Chinese stir-fry and dim sum',
        isOpen: true
      },
      {
        id: 'r6',
        name: 'Taco Fiesta',
        cuisine: 'Mexican',
        rating: 4.4,
        waitTime: 18,
        prepTime: 22,
        image: 'https://images.unsplash.com/photo-1565299507177-b0ac66763828',
        description: 'Fresh tacos, burritos, and Mexican street food',
        isOpen: true
      },
      {
        id: 'r7',
        name: 'Bangkok Street',
        cuisine: 'Thai',
        rating: 4.8,
        waitTime: 22,
        prepTime: 30,
        image: 'https://images.unsplash.com/photo-1559314809-0d155014e29e',
        description: 'Authentic Thai street food and curries',
        isOpen: true
      },
      {
        id: 'r8',
        name: 'The Steakhouse',
        cuisine: 'American',
        rating: 4.6,
        waitTime: 40,
        prepTime: 50,
        image: 'https://images.unsplash.com/photo-1544025162-d76694265947',
        description: 'Premium steaks and classic American dishes',
        isOpen: true
      }
    ];

    // Store each restaurant in KV store
    for (const restaurant of sampleRestaurants) {
      await kv.set(`restaurant:${restaurant.id}`, restaurant);
    }

    return c.json({ message: 'Restaurants initialized successfully', count: sampleRestaurants.length });
  } catch (error) {
    console.error('Initialize restaurants error:', error);
    return c.json({ error: 'Failed to initialize restaurants' }, 500);
  }
});

// Get user favorites (requires auth)
app.get("/make-server-b5d49619/favorites", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    if (!accessToken) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const { data: { user }, error } = await supabase.auth.getUser(accessToken);
    if (error || !user) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const favorites = await kv.get(`favorites:${user.id}`);
    return c.json({ favorites: favorites || [] });
  } catch (error) {
    console.error('Get favorites error:', error);
    return c.json({ error: 'Failed to fetch favorites' }, 500);
  }
});

// Add to favorites (requires auth)
app.post("/make-server-b5d49619/favorites", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    if (!accessToken) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const { data: { user }, error } = await supabase.auth.getUser(accessToken);
    if (error || !user) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const { restaurantId } = await c.req.json();
    const currentFavorites = await kv.get(`favorites:${user.id}`) || [];
    
    if (!currentFavorites.includes(restaurantId)) {
      currentFavorites.push(restaurantId);
      await kv.set(`favorites:${user.id}`, currentFavorites);
    }

    return c.json({ favorites: currentFavorites });
  } catch (error) {
    console.error('Add favorite error:', error);
    return c.json({ error: 'Failed to add favorite' }, 500);
  }
});

// Remove from favorites (requires auth)
app.delete("/make-server-b5d49619/favorites/:restaurantId", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    if (!accessToken) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const { data: { user }, error } = await supabase.auth.getUser(accessToken);
    if (error || !user) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const restaurantId = c.req.param('restaurantId');
    const currentFavorites = await kv.get(`favorites:${user.id}`) || [];
    
    const updatedFavorites = currentFavorites.filter((id: string) => id !== restaurantId);
    await kv.set(`favorites:${user.id}`, updatedFavorites);

    return c.json({ favorites: updatedFavorites });
  } catch (error) {
    console.error('Remove favorite error:', error);
    return c.json({ error: 'Failed to remove favorite' }, 500);
  }
});

Deno.serve(app.fetch);