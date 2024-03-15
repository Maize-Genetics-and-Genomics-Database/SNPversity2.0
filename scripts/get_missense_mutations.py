import sys
import re

vcf_file = sys.argv[1]
out_file = sys.argv[2]

with open(vcf_file, 'r') as file, open(out_file, 'w') as outfile:
    for line in file:
        if line.startswith('##'):
            continue
        elif line.startswith('#'):
            continue
        else :
            parts = line.strip().split('\t')

            for field in parts[7].split(';'):

                if field.startswith('ANN='):
                    split_values = field.split("|")
                    for i in range(1, len(split_values), 15):
                        try:
                            #print(split_values[i])
                            if "missense_variant" in split_values[i]:
                                out_string = split_values[i + 5] + "\t" + split_values[i + 9]
                                outfile.write(out_string+"\n")
                        except IndexError:
                            #print("Index out of range. Breaking the loop.")
                            break
