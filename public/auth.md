# Auth.md

## Site: Theatricalz — Professional Cinema, Photo & Audio Supply

## Agent Registration
No authentication required. All product catalog resources, specifications, and educational articles are publicly accessible.

## Public Resources
| Resource | URL |
|---|---|
| Product Catalog | https://theatricalz.com.au/shop/ |
| Categories API | https://theatricalz.com.au/api/categories |
| Products API | https://theatricalz.com.au/api/products |
| MCP Streamable Server | https://theatricalz.com.au/api/mcp |
| Blog & Technical Guides | https://theatricalz.com.au/blog/ |
| FAQ & Policies | https://theatricalz.com.au/faq/ |
| Finance Calculator | https://theatricalz.com.au/financing/ |

## Authentication

```json
{
  "agent_auth": {
    "register_uri": null,
    "identity_types_supported": ["none"],
    "credential_types_supported": ["none"],
    "notes": "No authentication required. All catalog resources are publicly accessible."
  }
}
```

## Ordering
Human-in-the-loop required. Agents may browse catalog items and prepare order drafts via the MCP `create_order_draft` tool. Final payment and identity verification are completed by a human via WhatsApp or secure online checkout.
