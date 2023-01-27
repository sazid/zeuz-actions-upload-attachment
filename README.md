# ZeuZ GitHub Action - Upload attachment
[![Test action](https://github.com/sazid/zeuz-actions-upload-attachment/actions/workflows/test.yml/badge.svg)](https://github.com/sazid/zeuz-actions-upload-attachment/actions/workflows/test.yml)

## Usage

```yaml
uses: sazid/zeuz-actions-upload-attachment@v1.0
with:
  zeuz_server_host: https://localhost
  zeuz_api_key: ${{ secrets.ZEUZ_API_KEY }}
  zeuz_attachment_type: global/test_case/step
  zeuz_attachment_item_id: TEST-1234
  zeuz_attachment_path: ./test.txt
  zeuz_attachment_replace: true
```

**We highly recommend to put the api key in GitHub secrets**.

See the [actions tab](https://github.com/sazid/zeuz-actions-upload-attachment/actions) for runs of this action! :rocket:
