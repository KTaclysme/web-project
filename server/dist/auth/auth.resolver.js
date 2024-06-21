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
exports.AuthResolver = void 0;
const graphql_1 = require("@nestjs/graphql");
const auth_service_1 = require("./auth.service");
const users_service_1 = require("../users/users.service");
const auth_input_1 = require("./dto/auth.input");
const auth_type_1 = require("./dto/auth.type");
const user_type_1 = require("../users/dto/user.type");
const unauthorized_exception_1 = require("../common/exceptions/unauthorized.exception");
let AuthResolver = class AuthResolver {
    constructor(authService, usersService) {
        this.authService = authService;
        this.usersService = usersService;
    }
    async login(authInput) {
        const user = await this.authService.validateUser(authInput.username, authInput.password);
        if (!user) {
            throw new unauthorized_exception_1.UnauthorizedException();
        }
        return this.authService.login(user);
    }
    async signup(authInput) {
        return this.usersService.create(authInput);
    }
};
exports.AuthResolver = AuthResolver;
__decorate([
    (0, graphql_1.Mutation)(() => auth_type_1.AuthType),
    __param(0, (0, graphql_1.Args)('authInput')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [auth_input_1.AuthInput]),
    __metadata("design:returntype", Promise)
], AuthResolver.prototype, "login", null);
__decorate([
    (0, graphql_1.Mutation)(() => user_type_1.UserType),
    __param(0, (0, graphql_1.Args)('authInput')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [auth_input_1.AuthInput]),
    __metadata("design:returntype", Promise)
], AuthResolver.prototype, "signup", null);
exports.AuthResolver = AuthResolver = __decorate([
    (0, graphql_1.Resolver)(),
    __metadata("design:paramtypes", [auth_service_1.AuthService,
        users_service_1.UsersService])
], AuthResolver);
//# sourceMappingURL=auth.resolver.js.map