import pandas
col_names = ['foodName','impact']


def CsvToJson(csv_path, json_path):
    data = pandas.read_csv(csv_path, names=col_names)
    data['foodName'] = data['foodName'].str.lower()
    data = data.set_index('foodName')
    data['replacement'] = ''
    json_string = data.to_json(json_path, orient='index')
    print(json_string)


csv_path = "../resources/rmit_dataset.csv"
json_path = "../resources/rmit_dataset.json"
CsvToJson(csv_path, json_path)