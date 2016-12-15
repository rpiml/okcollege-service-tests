// @flow

import { startCoreServices, startService, stopService, stopServices } from '../docker-compose';

import redis from 'redis';

import { csvpredict } from '../rmq';

let client = redis.createClient();

beforeAll(async () => {
  await startCoreServices();
  await startService('ml-predictor');
});

beforeAll(() => {

  redis.set('learning:college_training.csv', [
    [''                   , 'artsy', 'computery'],
    ['fine-arts-school'   , '1'    , '0'        ],
    ['computer-school'    , '0'    , '1'        ],
    ['digital-arts-school', '1'    , '1'        ],
    ['culinary-college',  , '0'    , '0'        ]
  ].map(a => a.join(',')).join('\n'));

  redis.set('learning:college_features.csv', [
    [''     , 'type', 'categories'],
    ['artsy'    , 'categorical', '2'  ],
    ['computery', 'categorical', '2'  ],
  ].map(a => a.join(',')).join('\n'));

  redis.set('learning:survey_training.csv', [
    [''     , 'like-art', 'like-computer', 'went-to'],
    ['user1', '0',      ,  '1'           , 'computer-school'     ],
    ['user2', '1',      ,  '1'           , 'digital-arts-school' ],
    ['user3', '1',      ,  '0'           , 'fine-arts-school'    ],
    ['user4', '0',      ,  '0'           , 'culinary-college'    ],
  ].map(a => a.join(',')).join('\n'));

  redis.set('learning:survey_features.csv', [
    [''                 , 'type'         ,  'categories'],
    ['like-art'         , 'categorical'  , '2'],
    ['like-computer'    , 'categorical'  , '2'],
    ['went-to'          , 'text-category',
      'fine-arts-school', 'computer-school','digital-arts-school',
      'culinary-college'],
  ].map(a => a.join(',')).join('\n'));

});

let simpleInput = [
  [''     , 'like-art', 'like-computer'].join(','),
  ['user5',      '1'  ,      '0'       ].join(',')
].join('\n');



it('should accept a prediction', async () => {
  // let prediction = await csvpredict(simpleInput);
  // console.log(prediction);
});
