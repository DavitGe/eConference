import { AppDataSource } from "../data-source";
import { User as UserEntity } from "../entity/User";

export interface IUser {
  id: number;
  username: string;
  email: string;
  passwordHash: string;
  role: string;
  twoFactorSecret?: string;
}

export class User implements IUser {
  static users: IUser[] = []; // Simulating a database

  constructor(
    public id: number,
    public username: string,
    public email: string,
    public passwordHash: string,
    public role: string,
    public twoFactorSecret?: string
  ) {}

  static async findByEmail(email: string): Promise<IUser | undefined> {
    const query = `SELECT * FROM user WHERE email = "${email}"`;
    const response = await AppDataSource.query(query);

    return response?.[0];
  }

  static async findById(id: number): Promise<IUser | undefined> {
    const query = `SELECT * FROM user WHERE id = ${id}`;
    const response = await AppDataSource.query(query);

    return response?.[0];
  }

  static async create(user: Omit<IUser, "id">): Promise<IUser | void> {
    const newUser = new UserEntity();
    newUser.username = user.username;
    newUser.email = user.email;
    newUser.passwordHash = user.passwordHash;
    newUser.role = user.role;
    newUser.twoFactorSecret = user.twoFactorSecret;
    newUser.isTwoFactorEnabled = !!user.twoFactorSecret;

    const userRepository = AppDataSource.getRepository(UserEntity);

    try {
      const savedUser = await userRepository.save(newUser);
      console.log("User has been saved:", savedUser);
      return savedUser;
    } catch (error) {
      console.error("Error saving user:", error);
    }
  }
}
