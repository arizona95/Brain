from marshmallow import Schema, fields, post_dump


__all__ = ('NetworkSchema', )


class NetworkSchema(Schema):
    id = fields.Int()
    name = fields.Str()
    networkPath = fields.Str()
    updated_at = fields.Int()
