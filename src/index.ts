import * as dotenv from 'dotenv';
dotenv.config();

import MongBot from './client/init';
import { config, token } from './config';

new MongBot(config).login(token);