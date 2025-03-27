#!/bin/bash

sentry-cli releases new legends@1.0.0 --project legends
sentry-cli releases files legends@1.0.0 upload-sourcemaps ./build/legends-prod/ --ext .js --ext .map --rewrite --project legends
sentry-cli releases finalize legends@1.0.0 --project legends