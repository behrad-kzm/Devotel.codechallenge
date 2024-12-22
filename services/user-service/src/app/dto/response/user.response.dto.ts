import { User } from "../../entities/user.entity";
import { USER_ROLE } from "../../enums/user-roles.enum";

export class UserResponseDto {
  id: string;
  name: string;
  email: string;
  role: USER_ROLE;

  constructor(data: User) {
    this.id = data.id;
    this.name = data.name;
    this.email = data.email;
    this.role = data.role;
  }
}