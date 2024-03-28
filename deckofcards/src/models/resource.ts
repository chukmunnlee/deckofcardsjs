export interface Metadata {
  id: string
  name: string
  description?: string
}

export interface Resource {
  apiVersion: string
  kind: string
  metadata: Metadata
}

