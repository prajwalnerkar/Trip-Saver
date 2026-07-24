import { http, HttpResponse } from 'msw';

export const handlers = [
  http.post('/api/login', async ({ request }) => {
    return HttpResponse.json({ token: 'mocked-jwt-token' }, { status: 200 });
  }),

 
];