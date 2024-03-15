import csv
import os
import sys

missense_file = sys.argv[1] #chrAll_missense_formatted.txt
paneffect_folder = sys.argv[2]
output_folder = sys.argv[3]

# Function to create the variant_check dictionary
def create_variant_check_dict(filepath):
    variant_check = {}
    with open(filepath, 'r') as file:
        reader = csv.reader(file, delimiter='\t')
        for row in reader:
            transcript, gene_model, wild_type, variant, position = row

            index = transcript + "_" + str(position) + "_" + wild_type + "_" + variant
            #print(index)
            variant_check[index] = True
    return variant_check

# Create the variant_check dictionary
variant_check = create_variant_check_dict(missense_file)

# Create the output folder if it doesn't exist
if not os.path.exists(output_folder):
    os.makedirs(output_folder)

for filename in os.listdir(paneffect_folder):
    if filename.endswith(".csv"):
        transcript_name = filename.rsplit('.', 1)[0]
        input_path = os.path.join(paneffect_folder, filename)
        output_path = os.path.join(output_folder, filename)

        with open(input_path, 'r') as input_file, open(output_path, 'w', newline='') as output_file:
            reader = csv.DictReader(input_file)
            fieldnames = reader.fieldnames + ['WGS']
            writer = csv.DictWriter(output_file, fieldnames=fieldnames)

            writer.writeheader()
            for row in reader:
                X, WT, Sub = row['X'], row['WT'], row['Sub']

                index2 = transcript_name.replace("_P", "_T") + "_" + str(X) + "_" + WT + "_" + Sub
                #print("Index 2 " + index2, flush=True)

                if index2 in variant_check :
                    row['WGS'] = '1'
                    print("Hit: " + index2, flush=True)
                else:
                    row['WGS'] = '0'
                writer.writerow(row)

print("Processing complete.")
