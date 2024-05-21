import { Injectable } from '@nestjs/common';
import { Role } from '@/entities';
import { RoleEnum } from '@/enums';
import { RoleRepository } from '@/repositories';

@Injectable()
export class RoleService {
  constructor(private readonly roleRepository: RoleRepository) {}

  /**
   * TODO : Create Roles Method
   **/

  async createRoles(): Promise<object> {
    const roles = Object.values(RoleEnum);
    const roleObjects = [];

    for (const role of roles) {
      const existingRole = await this.roleRepository.findByName(role);

      if (!existingRole) {
        const newRole = this.roleRepository.create({ name: role });
        await this.roleRepository.save(newRole);
        roleObjects.push({ role });
      }
    }

    return {
      message: 'Role created successfully!',
    };
  }

  /**
   * TODO : Mapper roles
   **/

  getNameRole(roles: Role[]) {
    const roleNames = [];
    roles.map((item) => roleNames.push(item.name));
    return roleNames;
  }
}
