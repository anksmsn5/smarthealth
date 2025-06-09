import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import type { RowDataPacket } from 'mysql2';

export async function POST(request: Request) {
    try {
      const { keyword, latitude, longitude } = await request.json();
  
      if (!latitude || !longitude) {
        return NextResponse.json(
          { error: 'Missing required fields: latitude, longitude' },
          { status: 400 }
        );
      }
  
      const keywordPattern = `%${keyword || ''}%`;
      const maxDistanceKm = 30; // search radius
  
      const sql = `
        SELECT 
          users.id AS user_id,
          users.name AS user_name,
          doctors.latitude,
          doctors.longitude,
          users.address,
          (
            6371 * acos(
              cos(radians(?)) * cos(radians(doctors.latitude)) * 
              cos(radians(doctors.longitude) - radians(?)) + 
              sin(radians(?)) * sin(radians(doctors.latitude))
            )
          ) AS distance
        FROM users
        INNER JOIN doctors ON users.id = doctors.user_id
        WHERE users.name LIKE ?
        HAVING distance < ?
        ORDER BY distance ASC
        LIMIT 20;
      `;
  
      const params = [
        latitude,
        longitude,
        latitude,
        keywordPattern,
        maxDistanceKm,
      ];
  
      const [rows] = await db.execute(sql, params);
  
      await db.end();
  
      return NextResponse.json({ results: rows });
    } catch (error) {
      console.error('Search API error:', error);
      return NextResponse.json(
        { error: 'Internal Server Error' },
        { status: 500 }
      );
    }
  }
  
