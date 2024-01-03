import {
  BadRequestException,
  Controller,
  Get,
  ParseIntPipe,
  Post,
  Query, Res,
  UploadedFile,
  UploadedFiles,
  UseInterceptors
} from "@nestjs/common";
import { AppService } from "./app.service";
import { FileInterceptor } from "@nestjs/platform-express";
import {existsSync} from "fs";
import { Response } from "express";
import * as Sharp from 'sharp'

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {
  }

  @Post("upload")
  @UseInterceptors(FileInterceptor("file", {
    dest: "uploads"
  }))
  uploadFile(@UploadedFile() file: Express.Multer.File) {
    console.log("file=", file);
    return file.path;
  }


  @Get("compression")
  async compression(
    @Query("path") filePath: string,
    @Query("color", ParseIntPipe) color: number,
    @Res() res: Response,
) {

    if (!existsSync(filePath)) {
      throw new BadRequestException("文件不存在");
    }

    const data = await Sharp(filePath, {
      animated: true,
      limitInputPixels: false
    }).gif({
      colours: color
    }).toBuffer()

    res.set('Content-Disposition', `attachment; filename="dest.gif"`)
    res.send(data)
  }
}
