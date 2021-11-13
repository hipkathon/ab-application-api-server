import {BootMixin} from '@loopback/boot';
import {ApplicationConfig, uuid} from '@loopback/core';
import Aws, {S3} from 'aws-sdk';
import {
  RestExplorerBindings,
  RestExplorerComponent,
} from '@loopback/rest-explorer';
import {RepositoryMixin} from '@loopback/repository';
import {RestApplication} from '@loopback/rest';
import {ServiceMixin} from '@loopback/service-proxy';
import path from 'path';
import {MySequence} from './sequence';
import multer from 'multer';
import multerS3 from 'multer-s3';
import{FILE_UPLOAD_SERVICE,STORAGE_DIRECTORY} from './keys';

Aws.config.loadFromPath(__dirname + '/../aws.config.json')

export {ApplicationConfig};

export class AbAppApiServerApplication extends BootMixin(
  ServiceMixin(RepositoryMixin(RestApplication)),
) {
  constructor(options: ApplicationConfig = {}) {
    super(options);

    // Set up the custom sequence
    this.sequence(MySequence);

    // Set up default home page
    this.static('/', path.join(__dirname, '../public'));

    // Customize @loopback/rest-explorer configuration here
    this.configure(RestExplorerBindings.COMPONENT).to({
      path: '/explorer',
    });
    this.component(RestExplorerComponent);
    this.configureFileUpload(options.fileStorageDirectory);

    this.projectRoot = __dirname;
    // Customize @loopback/boot Booter Conventions here
    this.bootOptions = {
      controllers: {
        // Customize ControllerBooter Conventions here
        dirs: ['controllers'],
        extensions: ['.controller.js'],
        nested: true,
      },
    };
  }

  protected configureFileUpload(destination?: string) {
    const s3 = new S3();

    // Upload files to `dist/.sandbox` by default
    // destination = destination ?? path.join(__dirname, '../.sandbox');
    // this.bind(STORAGE_DIRECTORY).to(destination);
    const multerOptions: multer.Options = {
      storage: multerS3({
        s3,
        bucket: 'plav-application-resources/origin',
        acl: 'public-read',
        key: (req, file, cb) => {
          return cb(null, file.originalname)
        },
      }),
      limits: { fileSize: 1000 * 1000 * 10 }
      // storage: multer.diskStorage({
      //   destination,
      //   // Use the original file name as is
      //   filename: (req, file, cb) => {
      //     const extension = '.' + file.originalname.split('.').slice(-1)[0];
      //     const filename = uuid() + extension;
      //     cb(null, filename);
      //   },
      // }),
    };
    // Configure the file upload service with multer options
    this.configure(FILE_UPLOAD_SERVICE).to(multerOptions);
  }
}
