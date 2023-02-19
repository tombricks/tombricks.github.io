# Effects

## Table of contents

* [set_colour](#set_colour)
* [set_cosmetic_flag](#set_cosmetic_flag)
* [set_name](#set_name)
* [set_long_name](#set_long_name)
* [set_owner](#set_owner)

### set_colour
* Scopes: COUNTRY
```json
{
    "type": "set_colour",
    "colour": "#FF0000",      "_comment": "Any CSS colour value or token"
}
```
Sets the country colour.

### set_cosmetic_flag
* Scopes: COUNTRY
```json
{
    "type": "set_cosmetic_flag",
    "flag": "assets/flags/GBR.png",      "_comment": "Link to image"
}
```
Sets the country cosmetic flag.

### set_name
* Scopes: ALL
```json
{
    "type": "set_name",
    "name": "FRA",      "_comment": "Localisation key or entry",
    "reset_long_name": true,      "_comment": "Optional, Only for country, will reset the longName to null meaning it will try to use [name]_long if possible",
    "long_name": "FRA_long",      "_comment": "Optional, Only for country, will set the long name",
}
```
Sets the scope's name and, for countries, optionally the long name.

### set_long_name
* Scopes: COUNTRY
```json
{
    "type": "set_long_name",
    "long_name": "BLR_republic",      "_comment": "Localisation key or entry"
}
```
Sets the country long name.

### set_owner
* Scopes: TILE
```json
{
    "type": "set_owner",
    "owner": "COG",      "_comment": "New owner",
    "transfer_control": true,       "_comment": "Optional, true transfers control, false doesn't transfer control, default (null) transfers if the previous owner had control too"
}
```
Sets the tile owner.