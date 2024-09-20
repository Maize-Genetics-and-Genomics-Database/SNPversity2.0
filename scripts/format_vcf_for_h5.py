import sys

def process_vcf(input_file, output_file):
    with open(input_file, 'r') as infile, open(output_file, 'w') as outfile:
        for line in infile:
            if line.startswith("##"):
                # Ignore lines starting with ##
                continue
            elif line.startswith("#CHROM"):
                # Remove the '#' from the #CHROM line and write it to the output
                outfile.write(line.lstrip('#'))
            else:
                # Write everything else as-is to the output
                outfile.write(line)

if __name__ == "__main__":
    if len(sys.argv) != 3:
        print("Usage: python script.py <input_vcf> <output_vcf>")
        sys.exit(1)

    input_vcf = sys.argv[1]
    output_vcf = sys.argv[2]

    process_vcf(input_vcf, output_vcf)
