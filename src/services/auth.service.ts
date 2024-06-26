import { compare, hash } from "bcrypt";
import { sign } from "jsonwebtoken";
import { PrismaClient, User } from "@prisma/client";
import { SECRET_KEY } from "@config";
import { CreateUserDto } from "@dtos/users.dto";
import { HttpException } from "@exceptions/HttpException";
import { DataStoredInToken, TokenData } from "@interfaces/auth.interface";
import { isEmpty } from "@utils/util";
import { SignUpDto } from "@/dtos/auth.dto";

class AuthService {
  public users = new PrismaClient().user;

  public async signup(signUpData: SignUpDto): Promise<User> {
    if (isEmpty(signUpData)) throw new HttpException(400, "Sign up data is empty");

    const findUser: User = await this.users.findUnique({ where: { email: signUpData.email } });
    if (findUser) throw new HttpException(409, `This email ${signUpData.email} already exists`);

    const guestId = signUpData.guestId || undefined;
    if (guestId) {
      delete signUpData.guestId;
    }

    const hashedPassword = await hash(signUpData.password, 10);
    const createUserData = await this.users.create({ data: { ...(signUpData as CreateUserDto), password: hashedPassword } });

    if (guestId) {
      await this.users.update({
        where: { id: createUserData.id },
        data: {
          selections: {
            connect: {
              guestId,
            },
          },
        },
      });
    }

    return createUserData;
  }

  public async login(userData: CreateUserDto): Promise<{ cookie: string; findUser: User }> {
    if (isEmpty(userData)) throw new HttpException(400, "userData is empty");

    const findUser: User = await this.users.findUnique({ where: { email: userData.email } });
    if (!findUser) throw new HttpException(409, `This email ${userData.email} was not found`);

    const isPasswordMatching: boolean = await compare(userData.password, findUser.password);
    if (!isPasswordMatching) throw new HttpException(409, "Password is not matching");

    const tokenData = this.createToken(findUser);
    const cookie = this.createCookie(tokenData);

    return { cookie, findUser };
  }

  public async logout(userData: User): Promise<User> {
    if (isEmpty(userData)) throw new HttpException(400, "userData is empty");

    const findUser: User = await this.users.findFirst({ where: { email: userData.email, password: userData.password } });
    if (!findUser) throw new HttpException(409, "User doesn't exist");

    return findUser;
  }

  public createToken(user: User): TokenData {
    const dataStoredInToken: DataStoredInToken = { id: user.id };
    const secretKey: string = SECRET_KEY;
    const expiresIn: number = 60 * 60 * 24 * 30;

    return { expiresIn, token: sign(dataStoredInToken, secretKey, { expiresIn }) };
  }

  public createCookie(tokenData: TokenData): string {
    return `Authorization=${tokenData.token}; Max-Age=${tokenData.expiresIn}; Path=/`;
  }
}

export default AuthService;
