import sys
import re

plink_file = sys.argv[1]
vcf_file = sys.argv[2]
out_file = sys.argv[3]

def convert_amino_acid_notation(start_notation):
    # Mapping of three-letter amino acid codes to one-letter codes
    amino_acid_map = {
        'Ala': 'A', 'Arg': 'R', 'Asn': 'N', 'Asp': 'D',
        'Cys': 'C', 'Glu': 'E', 'Gln': 'Q', 'Gly': 'G',
        'His': 'H', 'Ile': 'I', 'Leu': 'L', 'Lys': 'K',
        'Met': 'M', 'Phe': 'F', 'Pro': 'P', 'Ser': 'S',
        'Thr': 'T', 'Trp': 'W', 'Tyr': 'Y', 'Val': 'V'
    }

    # Extract the original and new amino acids and the position from the input
    input_notation = start_notation[2:]
    original_aa = input_notation[:3]
    position = input_notation[3:-3]
    new_aa = input_notation[-3:]

    # Convert the three-letter codes to one-letter codes
    original_aa_one_letter = amino_acid_map.get(original_aa)
    new_aa_one_letter = amino_acid_map.get(new_aa)

    # Construct the new notation
    if original_aa_one_letter and new_aa_one_letter:
        new_notation = original_aa_one_letter + position + new_aa_one_letter
        return new_notation
    else:
        return "NA"

def parse_info_string(info_str):
    mq=""
    cvc=""
    cvp=""
    types, effects, gene_models, subs = [], [], [], []

    for field in info_str.split(';'):
        if field.startswith('MQ='):
            mq=field
        if field.startswith('CVC='):
            cvc=field
        if field.startswith('CVP='):
            cvp=field
        if field.startswith('ANN='):
            split_values = field.split("|")
            for i in range(1, len(split_values), 15):
                try:
                    types.append(split_values[i])
                    effects.append(split_values[i + 1])
                    gene_models.append(split_values[i + 2])
                    subs.append(convert_amino_acid_notation(split_values[i + 9]))
                except IndexError:
                    print("Index out of range. Breaking the loop.")
                    break

    final_str = mq+";"+cvc+";"+cvp+";TYPE="+";".join(types)+";EFFECT="+";".join(effects)+";GENEMODEL="+";".join(gene_models)+";SUB="+";".join(subs)
    return final_str  # Return None if key not found


# Step 1: Read the first TSV file and build the dictionary
bp_values = {}
ccount = 0
with open(plink_file, 'r') as file:
    next(file)  # Skip the header

    for line in file:
        parts = re.split(r'\s+', line.strip())
        if len(parts) > 1:  # Check if the line has the required columns
            ccount += 1
            bp_a = int(parts[1])  # Assuming 'BP_A' is the second column
            bp_b = int(parts[4])  # Assuming 'BP_B' is the fifth column
            r2 = float(parts[6])  # Assuming 'BP_B' is the fifth column
            bp_values[bp_a] = r2
            bp_values[bp_b] = r2
            if ccount == 100000:
                print(bp_a, flush=True)
                ccount = 0

# Step 2 and 3: Read the second TSV file and write matching rows to the output file as they are found
with open(vcf_file, 'r') as file, open(out_file, 'w') as outfile:
    for line in file:
        if line.startswith('##'):
            continue
        elif line.startswith('#'):
            outfile.write(line)
        else :
            parts = line.strip().split('\t')
            if int(parts[1]) in bp_values:
                #parts[7] = parts[7].apply(lambda x: parse_info_value(x))
                parts[7] = parse_info_string(parts[7])+";MAXR2="+str(bp_values[int(parts[1])])
                outfile.write("\t".join(parts)+"\n")
