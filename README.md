# ZeuZ GitHub Action - Upload attachment
[![Test action](https://github.com/sazid/zeuz-actions-upload-attachment/test.yml/badge.svg)](https://github.com/sazid/zeuz-actions-upload-attachment/test.yml)

## Usage

```yaml
uses: sazid/zeuz-actions-upload-attachment@v1.0
with:
  zeuz_server_host: https://localhost
  zeuz_api_key: ${{ secrets.ZEUZ_API_KEY }}
  zeuz_attachment_type: global/test_case/step
  zeuz_attachment_item_id: TEST-1234
```

**We highly recommend to put the api key in GitHub secrets**.

See the [actions tab](https://github.com/sazid/zeuz-actions-upload-attachment/test.yml) for runs of this action! :rocket:

### Optional parameters

```
retry_timeout:
  description: 'retry timeout in seconds (default: 5)'
retry_interval:
  description: 'retry interval in seconds (default: 2)'
```
