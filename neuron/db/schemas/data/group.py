from marshmallow import Schema, fields, post_dump


__all__ = ('GroupSchema', )


class GroupSchema(Schema):
    id = fields.Int()
    name = fields.Str()
    groupPath = fields.Str()
    updated_at = fields.Int()
