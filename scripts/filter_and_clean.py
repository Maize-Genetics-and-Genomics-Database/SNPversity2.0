import sys
import re
import pandas as pd

vcf_file=sys.argv[1]
tsv_file=sys.argv[2]

def count_dotslashdot(row):
    """Count the occurrences of './.' in the row."""
    return sum(1 for sample in row[9:] if sample.startswith('./.'))

df = pd.read_csv('gencove_VCF_genotype_xref.tsv', sep='\t')
combined_header = "\t".join(df['Combined'])

# Open the VCF file for reading
with open(vcf_file, "r") as vcf_file:
    # Create a TSV file for writing
    with open(tsv_file, "w") as tsv_file:
        # Write the header row to the TSV file
        tsv_file.write("#CHROM\tPOS\tID\tREF\tALT\tQUAL\tFILTER\tINFO\tFORMAT\t" + combined_header + "\n")

        counter = 0;
        first = True
        # Iterate through each line in the VCF file
        for line in vcf_file:
            # Skip header lines
            if line.startswith("#"):
                continue

            # Split the VCF line by tabs
            fields = line.strip().split("\t")

            # Extract relevant information
            chrom = fields[0]
            pos = fields[1]
            ref = fields[3]
            alt = fields[4]
            qual = fields[5]
            info = fields[7]
            newinfo = "MQ=0"
            mq_value = 0
            full_genotype = ""
            coverage = 0
            full_count = 0

            for field in info.split(';'):
                if field.startswith('MQ='):
                    mq_value = float(field.split('=')[1])
                    newinfo = field

            # Extract and write genotype information for each sample
            for sample_info in fields[9:]:
                sample_fields = sample_info.split(":")
                genotype = sample_fields[0]
                full_genotype = full_genotype + "\t" + genotype
                if not genotype.startswith('./.'):
                    coverage += 1
                full_count += 1

            coverage_percent = 100 * (coverage / full_count)
            coverage_percent_str = "{:.2f}".format(coverage_percent)
            coverage_count_str = str(coverage)

            newinfo = newinfo + ";CVC=" + coverage_count_str + ";CVP=" + coverage_percent_str
            contains_comma = ',' in alt

            # Write the fixed fields to the TSV file
            if mq_value >= 30.0 and coverage_percent >=50 and not contains_comma:
                tsv_file.write(f"{chrom}\t{pos}\t.\t{ref}\t{alt}\t{qual}\t.\t{newinfo}\tGT{full_genotype}\n")
