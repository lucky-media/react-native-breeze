import ky from 'ky';

import { API_URL } from '@/constants/config';

const http = ky.create({
  prefixUrl: API_URL,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
});

export default http;
