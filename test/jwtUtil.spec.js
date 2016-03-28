import expect from 'expect';
import { isTokenExpired } from '../src/jwtUtil';

const expiredToken = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwczovL2Zvby5iYXIuY29tLyIsInN1YiI6Imdvb2dsZS1vYXV0aDJ8MTIzNDU2Nzg5MCIsImF1ZCI6ImFiYzEyM2ZvbzQ1NmJhciIsImV4cCI6MCwiaWF0IjowfQ.TIsy9apxm6CX0MrI6WjtHa3TTrY9iftp9ZQAkvi7_1Q';
const validToken = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwczovL2Zvby5iYXIuY29tLyIsInN1YiI6Imdvb2dsZS1vYXV0aDJ8MTIzNDU2Nzg5MCIsImF1ZCI6ImFiYzEyM2ZvbzQ1NmJhciIsImV4cCI6MTQ1OTE3NTc0OTAsImlhdCI6MTQ1OTEzOTc0OTB9.gqqWwsO1a7o6l2ffA9DZXnhMXuLti-3a8P_-G3Na3As';

describe('jwt utility functions', () => {
  it('should throw an error if the JWT parts < 3', async () => {
    expect(isTokenExpired)
      .withArgs('foo')
      .toThrow(/JWT must have 3 parts/);
  });

  it('should throw an error if the JWT parts > 3', async () => {
    expect(isTokenExpired)
      .withArgs('foo.bar.baz.foo')
      .toThrow(/JWT must have 3 parts/);
  });

  it('should return true if the token is expired', async () => {
    expect(isTokenExpired(expiredToken)).toEqual(true);
  });

  it('should return false if the token is not expired', async () => {
    expect(isTokenExpired(validToken)).toEqual(false);
  });
});
