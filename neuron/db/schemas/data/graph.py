from marshmallow import Schema, fields, post_dump


__all__ = ('GraphSchema')



class GraphSchema(Schema):
    id = fields.Int()
    name = fields.Str()
    parameter = fields.Raw()
    updated_at = fields.Int()
