# EarthRef's MagIC API

## Usage

The deployed API is currently available at http://api.earthref.org/MagIC/v0 with documentation at http://api.docs.earthref.org/MagIC/v0. These GET requests can be made in the browser to test the API:

#### Get the metadata for the latest 10 contributions as JSON rows:
- http://api.earthref.org/MagIC/v0/search/contributions

#### Get the metadata for the latest 20 locations that mention "sedimentary" as JSON rows:
- http://api.earthref.org/MagIC/v0/search/locations?size=20&query=sedimentary

#### Get contribution 16645 in MagIC Text File format:
- http://api.earthref.org/MagIC/v0/contribution/16645

These requests can also be made with an HTTP request client, for example with Python:

```
import requests
import pandas

# Get the 50 latest sites in MagIC
response = requests.get(
    'http://api.earthref.org/MagIC/v0/search/sites',
    params={'query': 'devonian', 'size': 50},
    headers={'Accept': 'application/json'}
)

# Parse the JSON output into a dictionary
json_response = response.json()

# Retrieve the list of sites, of which each site may have multiple data rows
sites = json_response['results']

# Flatten the sites rows
def flatten(listOflists):
    return [item for sublist in listOflists for item in sublist]
sites_rows = flatten(sites)

sites_df = pandas.DataFrame(sites_rows)
sites_df.head()
```


## Development

```
npm install
npm start
# API running at http://localhost:3100
# Docs available at http://localhost:3101
```

Try the endpoints:

```bash
curl -i http://localhost:3100/contributions
curl -i http://localhost:3100/contributions/1
```

