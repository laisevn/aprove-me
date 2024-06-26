import {
  Body,
  Controller, Delete,
  Get,
  HttpCode,
  HttpStatus, Param,
  Post, Put,
  Req,
  Res,
} from '@nestjs/common';
import { PayableService } from './payables.service';
import { PayableDto } from './dto/create-payable';
import { Response, Request } from 'express';
import * as helpers from '../shared/helpers';

@Controller('integrations')
export class PayableController {
  constructor(private readonly payableService: PayableService) {}

  @Post('payable')
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Body() payableDto: PayableDto,
    @Res() res: Response,
    @Req() req: Request
  ): Promise<Response> {
    const { value, emissionDate, assignor } = req.body

    if (helpers.isEmptyOrNull(value) ||
      helpers.isEmptyOrNull(emissionDate) ||
      helpers.isEmptyOrNull(assignor)) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        data: null,
        status: HttpStatus.BAD_REQUEST,
        message: 'Invalid Request. Param is missing.'
      });
    }

    if (!helpers.isValidDate(emissionDate)) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        data: null,
        status: HttpStatus.BAD_REQUEST,
        message: `Invalid Request. Param ${emissionDate} is invalid.`
      });
    }

    try {
      const payable = await this.payableService.create(payableDto);

      return res.status(HttpStatus.CREATED).json({
        data: [payable],
        status: HttpStatus.CREATED,
        message: 'Successfully created'
      });
    } catch (error) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        data: null,
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'An error occurred while creating the payable'
      });
    }
  }

  @Get('payable/:id')
  @HttpCode(HttpStatus.OK)
  async findOne(
    @Param('id') id,
    @Res() res: Response
  ): Promise<Response> {

    if (typeof id === 'undefined' || typeof id === null ) {
      return  res.status(HttpStatus.BAD_REQUEST).json({
        data: null,
        status: HttpStatus.BAD_REQUEST,
        message: `Invalid Request. Param ${id} is invalid.`
      });
    }

    try {
      const payable  = await this.payableService.findOne(id);

      if (payable === null) {
        return res.status(HttpStatus.NOT_FOUND).json({
          data: null,
          status: HttpStatus.NOT_FOUND,
          message: 'Payable not found'
        });
      }

      return  res.status(HttpStatus.OK).json({
        data: [payable],
        status: HttpStatus.OK,
        message: `Successfully found`
      });
    } catch (error) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        data: null,
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'An error occurred while creating the payable'
      });
    }
  }

  @Delete('payable/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param('id') id, @Res() res: Response): Promise<Response> {

    if (typeof id === 'undefined' || typeof id === null ) {
      return  res.status(HttpStatus.BAD_REQUEST).json({
        data: null,
        status: HttpStatus.BAD_REQUEST,
        message: `Invalid Request. Param ${id} is invalid.`
      });
    }
    const deletedPayable = await this.payableService.delete(id)
    return res.status(HttpStatus.NO_CONTENT).json({
      data: [deletedPayable],
      status: HttpStatus.NO_CONTENT,
      message: 'Successfully deleted'
    })
  }

  @Put('payable/:id')
  @HttpCode(HttpStatus.OK)
  async update(
    @Body() payableDto: PayableDto,
    @Param('id') id,
    @Res() res: Response
  ): Promise<Response> {

    if (typeof id === 'undefined' || typeof id === null ) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        data: null,
        status: HttpStatus.BAD_REQUEST,
        message: `Invalid Request. Param ${id} is invalid.`
      });
    }
    const payable = await this.payableService.update(id, payableDto)

    return res.status(HttpStatus.OK).json({
      data: [payable],
      status: HttpStatus.OK,
      message: 'Successfully updated'
    })
  }
}