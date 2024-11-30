import { _Object } from '@aws-sdk/client-s3';
import {
    AwsS3MultipartDto,
    AwsS3MultipartPartDto,
} from 'src/modules/aws/dtos/aws.s3-multipart.dto';
import { AwsS3Dto } from 'src/modules/aws/dtos/aws.s3.dto';
import { AwsS3PresignRequestDto } from 'src/modules/aws/dtos/request/aws.s3-presign.request.dto';
import { AwsS3PresignResponseDto } from 'src/modules/aws/dtos/response/aws.s3-presign.response.dto';
import { AwsS3ResponseDto } from 'src/modules/aws/dtos/response/aws.s3-response.dto';
import {
    IAwsS3DeleteDirOptions,
    IAwsS3GetItemsOptions,
    IAwsS3Options,
    IAwsS3PresignOptions,
    IAwsS3PutItem,
    IAwsS3PutItemWithAclOptions,
} from 'src/modules/aws/interfaces/aws.interface';

export interface IAwsS3Service {
    onModuleInit(): void;
    checkBucket(options?: IAwsS3Options): Promise<boolean>;
    checkItem(key: string, options?: IAwsS3Options): Promise<AwsS3Dto>;
    getItems(
        path: string,
        options?: IAwsS3GetItemsOptions
    ): Promise<AwsS3Dto[]>;
    getItem(key: string, options?: IAwsS3Options): Promise<AwsS3Dto>;
    putItem(file: IAwsS3PutItem, options?: IAwsS3Options): Promise<AwsS3Dto>;
    putItemWithAcl(
        file: IAwsS3PutItem,
        options?: IAwsS3PutItemWithAclOptions
    ): Promise<AwsS3Dto>;
    deleteItem(key: string, options?: IAwsS3Options): Promise<void>;
    deleteItems(keys: string[], options?: IAwsS3Options): Promise<void>;
    deleteDir(
        path: string,
        options?: IAwsS3DeleteDirOptions
    ): Promise<void | _Object[]>;
    createMultiPart(
        file: IAwsS3PutItem,
        maxPartNumber: number,
        options?: IAwsS3Options
    ): Promise<AwsS3MultipartDto>;
    createMultiPartWithAcl(
        file: IAwsS3PutItem,
        maxPartNumber: number,
        options?: IAwsS3PutItemWithAclOptions
    ): Promise<AwsS3MultipartDto>;
    putItemMultiPart(
        multipart: AwsS3MultipartDto,
        partNumber: number,
        file: Buffer,
        options?: IAwsS3Options
    ): Promise<AwsS3MultipartDto>;
    updateMultiPart(
        { exactSize, parts, ...others }: AwsS3MultipartDto,
        part: AwsS3MultipartPartDto
    ): AwsS3MultipartDto;
    completeMultipart(
        multipart: AwsS3MultipartDto,
        options?: IAwsS3Options
    ): Promise<void>;
    abortMultipart(
        multipart: AwsS3MultipartDto,
        options?: IAwsS3Options
    ): Promise<void>;
    presign(
        key: string,
        options?: IAwsS3PresignOptions
    ): Promise<AwsS3PresignResponseDto>;
    mapPresign(
        { key, size, duration }: AwsS3PresignRequestDto,
        options?: IAwsS3Options
    ): AwsS3Dto;
    getBucket(options?: IAwsS3Options): string;
    getRegion(options?: IAwsS3Options): string;
    mapResponse(dto: AwsS3Dto): AwsS3ResponseDto;
}
