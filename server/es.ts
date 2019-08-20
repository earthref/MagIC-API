import { Client, RequestParams, ApiResponse } from '@elastic/elasticsearch';

const index = 'magic_v4';
const client = new Client({ node: process.env.ES_NODE || 'localhost:9200' });

// Complete definition of the Search response
interface ShardsResponse {
  total: number;
  successful: number;
  failed: number;
  skipped: number;
}

interface Explanation {
  value: number;
  description: string;
  details: Explanation[];
}

interface SearchResponse {
  took: number;
  timed_out: boolean;
  _scroll_id?: string;
  _shards: ShardsResponse;
  hits: {
    total: number;
    max_score: number;
    hits: Array<{
      _index: string;
      _type: string;
      _id: string;
      _score: number;
      _source: any;
      _version?: number;
      _explanation?: Explanation;
      fields?: any;
      highlight?: any;
      inner_hits?: any;
      matched_queries?: string[];
      sort?: string[];
    }>;
  };
  aggregations?: any;
  err?: Explanation;
}

// Check the ES connection status
async function checkConnection() {
  let isConnected = false;
  while (!isConnected) {
    console.log('Connecting to ES');
    try {
      const health = await client.cluster.health({});
      console.log(health);
      isConnected = true;
    } catch (err) {
      console.log('Connection Failed, Retrying...', err);
    }
  }
}
export { checkConnection };

// Get public contribution by ID
async function getContributionByID(id: string) {
  const params: RequestParams.Search = {
    index,
    type: 'contribution',
    body: {
      query: {
        bool: {
          must: [{
            term: {
              'summary.contribution.id': id,
            },
          }, {
            term: {
              'summary.contribution._is_activated': true,
            },
          }],
        },
      },
    },
  };

  const resp: ApiResponse<SearchResponse> = await client.search(params);
  return resp.body.hits.total > 0 && resp.body.hits.hits[0]._source.contribution || undefined;
}
export { getContributionByID };

// Search public contributions
async function getSearchByTable(
  { table = 'contribution', size = 10, from = 0, query = '' }:
  { table?: string, size?: number, from?: number, query?: string } = {},
) {
  const params: RequestParams.Search = {
    index,
    type: table,
    size,
    from,
    body: {
      query: {
        bool: {
          must: [query && {
            simple_query_string: {
              query,
            },
          } || true, {
            term: {
              'summary.contribution._is_activated': true,
            },
          }],
        },
      },
    },
  };

  const resp: ApiResponse<SearchResponse> = await client.search(params);
  return resp.body.hits.total > 0 && {
    total: resp.body.hits.total,
    size,
    from,
    query,
    results: resp.body.hits.hits.map((x) => x._source.contribution),
  } || undefined;
}
export { getSearchByTable };
