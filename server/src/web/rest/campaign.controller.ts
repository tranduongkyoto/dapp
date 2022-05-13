import {
    Body,
    Controller,
    Delete,
    Get,
    Logger,
    Param,
    Post,
    Put,
    UseGuards,
    Req,
    UseInterceptors,
    ClassSerializerInterceptor,
} from '@nestjs/common';
import { AuthGuard, Roles, RolesGuard, RoleType } from '../../security';
import { PageRequest, Page } from '../../domain/base/pagination.entity';
import { UserDTO } from '../../service/dto/user.dto';
import { HeaderUtil } from '../../client/header-util';
import { Request } from '../../client/request';
import { LoggingInterceptor } from '../../client/interceptors/logging.interceptor';
import { ApiBearerAuth, ApiUseTags, ApiResponse, ApiOperation } from '@nestjs/swagger';
import { UserService } from '../../service/user.service';

@Controller('api/campaign')
@UseGuards(AuthGuard, RolesGuard)
@UseInterceptors(LoggingInterceptor, ClassSerializerInterceptor)
@ApiBearerAuth()
export class CampaignController {
    logger = new Logger('CampaignController');

    constructor(private readonly userService: UserService) { }

    @Get('/')
    //@Roles(RoleType.ADMIN)
    @ApiOperation({ title: 'Get the list of campaign' })
    @ApiResponse({
        status: 200,
        description: 'List all campaign',
        type: UserDTO,
    })
    async getAllCampaigns(@Req() req: Request): Promise<UserDTO[]> {
        const sortField = req.query.sort;
        const pageRequest: PageRequest = new PageRequest(req.query.page, req.query.size, sortField);
        const [results, count] = await this.userService.findAndCount({
            skip: +pageRequest.page * pageRequest.size,
            take: +pageRequest.size,
            order: pageRequest.sort.asOrder(),
        });
        HeaderUtil.addPaginationHeaders(req.res, new Page(results, count, pageRequest));
        return results;
    }

}
