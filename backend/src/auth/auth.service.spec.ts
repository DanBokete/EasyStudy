import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { PrismaService } from '../prisma.service';
import { JwtService } from '@nestjs/jwt';
import { ForbiddenException } from '@nestjs/common';
import * as argon2 from 'argon2';
import { Response, Request } from 'express';
import { TokenService } from '../token/token.service';
describe('AuthService', () => {
  let service: AuthService;

  const mockJwtService = {
    sign: jest.fn(),
  };

  const mockPrismaService = {
    user: {
      findUnique: jest.fn(),
      create: jest.fn(),
      updateMany: jest.fn(),
    },
    refreshToken: {
      create: jest.fn(),
      findMany: jest.fn(),
      updateMany: jest.fn(),
      update: jest.fn(),
      deleteMany: jest.fn(),
    },
  };

  const mockResponse: Partial<Response> = {
    cookie: jest.fn(),
    clearCookie: jest.fn(),
  };
  // const mockTokenService = {
  //   createAccessToken: jest.fn(),
  //   createRefreshToken: jest.fn(),
  // };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: PrismaService, useValue: mockPrismaService },
        { provide: JwtService, useValue: mockJwtService },
        {
          provide: TokenService,
          useClass: TokenService,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('login', () => {
    it('should throw ForbiddenException if user is not found', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue(null);

      await expect(
        service.login(
          { username: 'test@example.com', password: '1234' },
          mockResponse as Response,
        ),
      ).rejects.toThrow(ForbiddenException);
    });

    it('should throw ForbiddenException if password does not match', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue({
        email: 'test@example.com',
        password: 'hashed',
        id: 1,
      });

      jest.spyOn(argon2, 'verify').mockResolvedValue(false);

      await expect(
        service.login(
          { username: 'test@example.com', password: 'wrongpass' },
          mockResponse as Response,
        ),
      ).rejects.toThrow(ForbiddenException);
    });

    it('should set cookies if login is successful', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue({
        email: 'test@example.com',
        password: 'hashed',
        id: 1,
      });

      jest.spyOn(argon2, 'verify').mockResolvedValue(true);
      jest.spyOn(argon2, 'hash').mockResolvedValue('hashed');

      mockJwtService.sign
        .mockReturnValueOnce('accessToken')
        .mockReturnValueOnce('refreshToken');

      await service.login(
        { username: 'test@example.com', password: 'correct-password' },
        mockResponse as Response,
      );

      expect(mockResponse.cookie).toHaveBeenCalledWith(
        'refresh_token',
        'refreshToken',
        expect.objectContaining({ httpOnly: true }),
      );

      expect(mockResponse.cookie).toHaveBeenCalledWith(
        'access_token',
        'accessToken',
        expect.objectContaining({ httpOnly: true }),
      );
    });

    it('should return nothing', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue({
        id: 1,
        username: 'test@gmail.com',
        password: '#Test123',
      });

      await expect(
        service.login(
          { username: 'test@gmail.com', password: '#Test123' },
          mockResponse as Response,
        ),
      ).resolves.toBeUndefined();
    });
  });

  describe('signup', () => {
    const mockSignupDto = {
      username: 'test@gmail.com',
      password: '#Test123',
      name: 'Dan',
    };

    const mockUser = {
      id: 1,
      email: 'test@gmail.com',
      password: 'hashedpassword',
      name: 'Dan',
    };
    it('should not return password', async () => {
      mockPrismaService.user.create.mockResolvedValue(mockUser);
      jest.spyOn(argon2, 'hash').mockResolvedValue('hashedPassword');

      const result = await service.signup(
        mockSignupDto,
        mockResponse as Response,
      );
      expect(result).not.toHaveProperty('password');
    });

    it('should hash the password during signup', async () => {
      const hashedPassword = mockUser.password;
      const plainPassword = mockSignupDto.password;

      jest.spyOn(argon2, 'hash').mockResolvedValue(hashedPassword);

      mockPrismaService.user.create.mockResolvedValue({
        mockUser,
      });

      await service.signup(mockSignupDto, mockResponse as Response);

      expect(argon2.hash).toHaveBeenCalledWith(plainPassword);

      expect(mockPrismaService.user.create).toHaveBeenCalledWith({
        data: {
          email: mockSignupDto.username,
          password: hashedPassword,
          name: mockSignupDto.name,
        },
      });
    });
  });

  describe('refreshToken', () => {
    it('should throw ForbiddenException if user is not authenticated', async () => {
      await expect(
        service.refreshToken(
          // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
          { user: undefined } as any,
          mockResponse as Response,
        ),
      ).rejects.toThrow(ForbiddenException);
    });

    it('should set new cookies if refresh token is valid', async () => {
      const mockRefreshToken = '123';
      const mockUser = { username: 'd@mail.com', id: 'one' };

      const mockRequest = {
        user: mockUser,
        cookies: { refresh_token: mockRefreshToken },
      } as unknown as Request;

      mockPrismaService.refreshToken.findMany.mockResolvedValue([
        { userId: mockUser.id, token: mockRefreshToken, valid: true },
      ]);
      mockPrismaService.user.findUnique.mockResolvedValue(mockUser);

      jest.spyOn(argon2, 'verify').mockResolvedValue(true);

      mockJwtService.sign
        .mockReturnValueOnce('newAccessToken')
        .mockReturnValueOnce('newRefreshToken');

      const response = await service.refreshToken(
        mockRequest,
        mockResponse as Response,
      );

      expect(mockResponse.cookie).toHaveBeenCalledWith(
        'access_token',
        'newAccessToken',
        expect.objectContaining({ httpOnly: true }),
      );

      expect(mockResponse.cookie).toHaveBeenCalledWith(
        'refresh_token',
        'newRefreshToken',
        expect.objectContaining({ httpOnly: true }),
      );

      expect(response).toBeUndefined();
    });
  });
});
