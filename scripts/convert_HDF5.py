import pandas as pd
import h5py
import sys
import numpy as np

# Check command-line arguments
if len(sys.argv) != 3:
    print("Usage: python script.py <input_vcf> <output_hdf5>")
    sys.exit(1)

vcf_file = sys.argv[1]
hdf5_file = sys.argv[2]
chunk_size =  sys.argv[3]  # Adjust chunk size based on memory

str_dtype = h5py.special_dtype(vlen=str)
#chunk_size = 100000  # Adjust chunk size based on memory

# Standard VCF columns
standard_columns = ['#CHROM', 'POS', 'ID', 'REF', 'ALT', 'QUAL', 'FILTER', 'INFO', 'FORMAT']

# Function to handle dynamic genotype columns
def get_genotype_columns(df_chunk):
    return [col for col in df_chunk.columns if col not in standard_columns]

# Open HDF5 file for writing
with h5py.File(hdf5_file, 'w') as hdf5_out:
    datasets = {}
    num_rows_written = 0

    for df_chunk in pd.read_csv(vcf_file, sep='\t', chunksize=chunk_size):
        # Sort chunk by POS
        df_chunk.sort_values(by='POS', inplace=True)

        # Identify genotype columns dynamically
        genotype_columns = get_genotype_columns(df_chunk)

        # Define datasets for new columns
        for col in standard_columns + genotype_columns:
            if col not in datasets:
                if col == 'POS':
                    data_type = 'i8'  # Integer type for positions
                elif col in standard_columns:
                    data_type = str_dtype  # String type for other standard columns
                else:
                    data_type = 'i8'  # Assuming genotypes are integers
                datasets[col] = hdf5_out.create_dataset(col, (0,), maxshape=(None,), dtype=data_type)

    # Resize and write data to datasets
    for col in datasets.keys():
        datasets[col].resize(num_rows_written + len(df_chunk), axis=0)

        # Handle genotype columns as variable-length strings
        if col in genotype_columns:
            data_to_write = df_chunk[col].astype(str).values
        elif hdf5_out[col].dtype == str_dtype:
            # Convert to string, handling NaN and None
            data_to_write = df_chunk[col].fillna('').astype(str).values
        elif hdf5_out[col].dtype == np.dtype('i8'):
            # Convert to integer
            data_to_write = df_chunk[col].astype('i8').values
        else:
            # Handle other data types as needed
            data_to_write = df_chunk[col].values

        # Write data to HDF5 dataset
        try:
            datasets[col][num_rows_written:num_rows_written + len(df_chunk)] = data_to_write

        except Exception as e:
            print(f"Error writing column '{col}': {e}")

    num_rows_written += len(df_chunk)

print("Data saved to HDF5 file:", hdf5_file)
