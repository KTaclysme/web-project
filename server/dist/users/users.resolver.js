"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersResolver = void 0;
const graphql_1 = require("@nestjs/graphql");
const users_service_1 = require("./users.service");
const user_type_1 = require("./dto/user.type");
const common_1 = require("@nestjs/common");
const gql_jwt_auth_guard_1 = require("../auth/gql-jwt-auth.guard");
let UsersResolver = class UsersResolver {
    constructor(usersService) {
        this.usersService = usersService;
    }
    async me(context) {
        const { userId } = context.req.user;
        return this.usersService.findOneById(userId);
    }
    async users() {
        return this.usersService.findAll();
    }
    async user(id) {
        return this.usersService.findOneById(id);
    }
};
exports.UsersResolver = UsersResolver;
__decorate([
    (0, common_1.UseGuards)(gql_jwt_auth_guard_1.GqlJwtAuthGuard),
    (0, graphql_1.Query)(returns => user_type_1.UserType),
    __param(0, (0, graphql_1.Context)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UsersResolver.prototype, "me", null);
__decorate([
    (0, graphql_1.Query)(returns => [user_type_1.UserType]),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], UsersResolver.prototype, "users", null);
__decorate([
    (0, graphql_1.Query)(returns => user_type_1.UserType, { nullable: true }),
    __param(0, (0, graphql_1.Args)('id', { type: () => Number })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], UsersResolver.prototype, "user", null);
exports.UsersResolver = UsersResolver = __decorate([
    (0, graphql_1.Resolver)(of => user_type_1.UserType),
    __metadata("design:paramtypes", [users_service_1.UsersService])
], UsersResolver);
//# sourceMappingURL=users.resolver.js.map