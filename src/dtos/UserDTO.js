export default class UserDTO {
  constructor({ _id, email, role, name }) {
    this.id = _id;
    this.email = email;
    this.role = role;
    this.name = name;

  }
}
