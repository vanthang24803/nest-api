import { Injectable } from '@nestjs/common';
import { Role, Role as RoleEntity } from '@/entities';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RoleEnum } from '@/enums';

@Injectable()
export class RoleService {
  constructor(
    @InjectRepository(RoleEntity)
    private readonly roleRepository: Repository<RoleEntity>,
  ) {}

  /**
   * TODO : Create Roles Method
   **/

  async createRoles(): Promise<object> {
    const roles = Object.values(RoleEnum);
    const roleObjects = [];

    for (const role of roles) {
      const existingRole = await this.roleRepository.findOneBy({ name: role });

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
