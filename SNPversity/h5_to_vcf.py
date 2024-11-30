import h5py
import sys
import json
import datetime
import numpy as np

# Command line arguments
hdf5_file_path = sys.argv[1]
output_vcf_path = sys.argv[2]
lower_bound = int(sys.argv[3])
upper_bound = int(sys.argv[4])
json_string = sys.argv[5]

# Variable list
var_list = ['CHROM', 'POS', 'REF', 'ALT', 'QUAL', 'INFO']

#genome_list = ['1_SRR17046119', '10_SRR17045932', '1003_SRR17045852', '1004_SRR17045851', '1005_SRR17045850','GEMS55_SRR8906658','Liao6082_CRX446062','MC9274_CRX444643','B97_CRX445264','CML229_SRR8906636','CIMBL135_SRR8906674','GEMS40_SRR8906699','GEMS45_SRR8906700','GEMS12_SRR8906701','SHEN5003_SRR8906702','Ye488_CRX445442', '32_CRX445446', 'Ye8112_CRX445447', 'FR218_CRX445451', 'Zheng58_CRX445453','75_322_CRX445460', 'L069_CRX445464', 'L005_CRX445466', 'Shen135_CRX445467', 'Zun90110_CRX445471','ShuangM9B_1_CRX445474']

genome_list = json.loads(json_string)
# Reverse mapping from integers to genotype strings
#reverse_genotype_mapping = {0: "0/0", 1: "1/1", 2: "1/1", 3: "./."}
reverse_genotype_mapping = {0: "0", 1: "1", 2: "2", 3: "."}


current_date = datetime.date.today().strftime('%Y%m%d')

ID = "."
FILTER = "."
FORMAT = "GT"

with h5py.File(hdf5_file_path, 'r') as hdf5_file:
    # Check if 'POS' dataset exists
    if 'POS' not in hdf5_file:
        print("No 'POS' dataset found in the file.")
        sys.exit(1)

    # Read 'POS' data
    pos_data = hdf5_file['POS'][:]

    # Convert 'POS' data from objects to integers
    try:
        #pos_data = np.array([int(pos) for pos in pos_data if pos is not None])
        # Convert 'POS' data from byte strings to strings
        pos_data = np.array([int(pos.decode('utf-8')) if isinstance(pos, bytes) else int(pos) for pos in pos_data])

    except ValueError as e:
        print(f"Error converting 'POS' data to integers: {e}")
        sys.exit(1)

    # Print the data type of the 'POS' dataset
    #print("Data type of 'POS':", pos_data.dtype)

    # Find the range of indices for the required positions
    lower_index = np.searchsorted(pos_data, lower_bound, side='left')
    upper_index = np.searchsorted(pos_data, upper_bound, side='right')

    # Read the required slices of datasets
    variant_data = {var: hdf5_file[var][lower_index:upper_index] for var in var_list}
    genome_data = {genome: hdf5_file[genome][lower_index:upper_index] for genome in genome_list if genome in hdf5_file}


# Writing to VCF file

if len(variant_data['POS']) == 0:
    print("No data found in the specified position range.")
else:
    with open(output_vcf_path, 'w') as vcf_file:

        if "maizegdb" in hdf5_file_path:
            vcf_file.write("##fileformat=VCFv4.2\n")
            vcf_file.write("##fileDate=" + current_date + "\n")
            vcf_file.write("##source=Fusarium2024\n")
            vcf_file.write("##reference=TBD\n")
            vcf_file.write("##INFO=<ID=MQ,Number=1,Type=Float,Description=\"RMS mapping quality.\">\n")
            vcf_file.write("##INFO=<ID=CVC,Number=1,Type=Integer,Description=\"The number of accessions that have genotype data for a particular variant.\">\n")
            vcf_file.write("##INFO=<ID=CVP,Number=1,Type=Float,Description=\"The percent of accessions that have genotype data for a particular variant.\">\n")
            vcf_file.write("##INFO=<ID=TYPE,Number=.,Type=String,Description=\"The type of effect using Sequence Ontology terms.\">\n")
            vcf_file.write("##INFO=<ID=EFFECT,Number=.,Type=String,Description=\"An estimation of putative impact/deleteriousness.\">\n")
            vcf_file.write("##INFO=<ID=GENEMODEL,Number=.,Type=String,Description=\"The name of the gene model affected by the variant.\">\n")
            vcf_file.write("##INFO=<ID=SUB,Number=.,Type=String,Description=\"The amino acid substitution for missense and non-synonymous variants.\">\n")
            vcf_file.write("##INFO=<ID=MAXR2,Number=1,Type=Float,Description=\"The maximum R2 for a given loci.\">\n")
            vcf_file.write("##FORMAT=<ID=GT,Number=1,Type=String,Description=\"Genotype\">\n")
            vcf_file.write("#" + "\t".join(["CHROM", "POS", "ID", "REF", "ALT", "QUAL", "FILTER", "INFO", "FORMAT"] + genome_list) + "\n")


        for i in range(len(variant_data['POS'])):
            row = [
                variant_data['CHROM'][i].decode('utf-8') if isinstance(variant_data['CHROM'][i], bytes) else str(variant_data['CHROM'][i]),
                variant_data['POS'][i].decode('utf-8') if isinstance(variant_data['POS'][i], bytes) else variant_data['POS'][i],
                ID,
                variant_data['REF'][i].decode('utf-8') if isinstance(variant_data['REF'][i], bytes) else variant_data['REF'][i],
                variant_data['ALT'][i].decode('utf-8') if isinstance(variant_data['ALT'][i], bytes) else variant_data['ALT'][i],
                variant_data['QUAL'][i].decode('utf-8') if isinstance(variant_data['QUAL'][i], bytes) else variant_data['QUAL'][i],
                FILTER,
                variant_data['INFO'][i].decode('utf-8') if isinstance(variant_data['INFO'][i], bytes) else variant_data['INFO'][i],
                FORMAT
            ]
            genotypes = [reverse_genotype_mapping[genome_data[genome][i]] for genome in genome_list]
            #genotypes = [genome_data[genome][i] for genome in genome_list]

            vcf_file.write("\t".join(row + genotypes) + "\n")

print(f"VCF data has been saved to {output_vcf_path}")
