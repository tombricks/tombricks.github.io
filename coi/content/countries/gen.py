data = {
    "GBR": {
        "color": "#DE8787",
        "flag": "assets/flags/GBR.png"
    },

    "GER": {
        "color": "#949494",
        "flag": "assets/flags/GER.png"
    },

    "KOS": {
        "color": "#244aa5",
        "flag": "assets/flags/KOS.png"
    },

    "MON": {
        "color": "#6c8c2a",
        "flag": "assets/flags/MON.png"
    },

    "SLO": {
        "color": "#5c89c1",
        "flag": "assets/flags/SLO.png"
    },

    "SLV": {
        "color": "#005ce5",
        "flag": "assets/flags/SLV.png"
    },

    "CRO": {
        "color": "#f546b4",
        "flag": "assets/flags/CRO.png"
    },

    "MAC": {
        "color": "#008000",
        "flag": "assets/flags/MAC.png"
    },

    "BIH": {
        "color": "#ffd200",
        "flag": "assets/flags/BIH.png"
    },

    "ALB": {
        "color": "#952d66",
        "flag": "assets/flags/ALB.png"
    },

    "LIT": {
        "color": "#fdb913",
        "flag": "assets/flags/LIT.png"
    },

    "EST": {
        "color": "#0066cc",
        "flag": "assets/flags/EST.png"
    },

    "LAT": {
        "color": "#9e3039",
        "flag": "assets/flags/LAT.png"
    },

    "UKR": {
        "color": "#0057b7",
        "flag": "assets/flags/UKR.png"
    },

    "RUS": {
        "color": "#467846",
        "flag": "assets/flags/RUS.png"
    },

    "BEL": {
        "color": "#c1ab08",
        "flag": "assets/flags/BEL.png"
    },

    "MOL": {
        "color": "#ee8f10",
        "flag": "assets/flags/MOL.png"
    },

    "TRN": {
        "color": "#de0000",
        "flag": "assets/flags/TRN.png"
    },

    "ITA": {
        "color": "#009246",
        "flag": "assets/flags/ITA.png"
    },

    "CZE": {
        "color": "#2a598c",
        "flag": "assets/flags/CZE.png"
    },

    "HUN": {
        "color": "#477050",
        "flag": "assets/flags/HUN.png"
    },

    "ROM": {
        "color": "#fcd116",
        "flag": "assets/flags/ROM.png"
    },

    "BUL": {
        "color": "#00966e",
        "flag": "assets/flags/BUL.png"
    },

    "GRE": {
        "color": "#0d5eaf",
        "flag": "assets/flags/GRE.png"
    },

    "IRE": {
        "color": "#169b62",
        "flag": "assets/flags/IRE.png"
    },

    "ICE": {
        "color": "#02529c",
        "flag": "assets/flags/ICE.png"
    },

    "SPA": {
        "color": "#fabd00",
        "flag": "assets/flags/SPA.png"
    },

    "POR": {
        "color": "#006600",
        "flag": "assets/flags/POR.png"
    },

    "DEN": {
        "color": "#99745d",
        "flag": "assets/flags/DEN.png"
    },

    "SER": {
        "color": "#0c4076",
        "flag": "assets/flags/SER.png"
    },

    "SWI": {
        "color": "#d62718",
        "flag": "assets/flags/SWI.png"
    },

    "AUS": {
        "color": "#c2c6d7",
        "flag": "assets/flags/AUS.png"
    },

    "FRA": {
        "color": "#0037a9",
        "flag": "assets/flags/FRA.png"
    },

    "NET": {
        "color": "#ff9900",
        "flag": "assets/flags/NET.png"
    },

    "LUX": {
        "color": "#00a1de",
        "flag": "assets/flags/LUX.png"
    },

    "SWE": {
        "color": "#006aa7",
        "flag": "assets/flags/SWE.png"
    },

    "NOR": {
        "color": "#6f4747",
        "flag": "assets/flags/NOR.png"
    },

    "FIN": {
        "color": "#ffffff",
        "flag": "assets/flags/FIN.png"
    },

    "POL": {
        "color": "#d4213d",
        "flag": "assets/flags/POL.png"
    },

    "BLR": {
        "color": "#8e9b52",
        "flag": "assets/flags/BLR.png"
    },

    "DNR": {
        "color": "#492140",
        "flag": "assets/flags/DNR.png"
    },

    "LNR": {
        "color": "#676497",
        "flag": "assets/flags/LNR.png"
    }
}
for tag in data:
    f = F"""[
    {{
        "type": "set_colour",
        "colour": "{data[tag]["color"]}"
    }},
    {{
        "type": "set_flag",
        "flag": "{data[tag]["flag"]}"
    }}
]"""
    with open(tag+".json", 'w') as file:
        file.write(f)
    print(f)
