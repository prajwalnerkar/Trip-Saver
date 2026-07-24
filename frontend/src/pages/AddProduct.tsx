import React, {
  useState,
  useEffect,
  useMemo,
  ChangeEvent,
  ReactElement,
} from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../store/store";
import {
  addProduct,
  addOffer,
  addAd,
  fetchProducts,
  fetchOffers,
  fetchAds,
  updateProduct,
  updateOffer,
  updateAd,
  deleteProduct,
  deleteOffer,
  deleteAd,
  toggleProductSharing,
  toggleOfferSharing,
  toggleAdSharing,
} from "../slice/shopSlice";
import { Formik, Form, Field, FieldProps } from "formik";
import * as Yup from "yup";

import {
  Box,
  Paper,
  Tabs,
  Tab,
  TextField,
  Button,
  Typography,
  Stack,
  Grid,
  CircularProgress,
  InputAdornment,
  Avatar,
  IconButton,
  Fade,
  Snackbar,
  Alert,
  useTheme,
  useMediaQuery,
  Chip,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Skeleton,
  Divider,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TableContainer,
} from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import CloseIcon from "@mui/icons-material/Close";
import Inventory2Icon from "@mui/icons-material/Inventory2";
import LocalOfferIcon from "@mui/icons-material/LocalOffer";
import CampaignIcon from "@mui/icons-material/Campaign";
import CurrencyRupeeIcon from "@mui/icons-material/CurrencyRupee";
import LinkIcon from "@mui/icons-material/Link";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import VisibilityIcon from "@mui/icons-material/Visibility";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import PauseCircleOutlinedIcon from "@mui/icons-material/PauseCircleOutlined";
import PlayCircleOutlinedIcon from "@mui/icons-material/PlayCircleOutlined";
import ImageNotSupportedIcon from "@mui/icons-material/ImageNotSupported";

interface ProductFormState {
  name: string;
  brand: string;
  price: string;
  quantity: string;
}
interface OfferFormState {
  offerTitle: string;
  discount: string;
  validUntil: string;
  targetProduct: string;
}
interface AdFormState {
  adTitle: string;
  placement: string;
  targetUrl: string;
}
type SubmitType = "product" | "offer" | "ad";

interface SnackState {
  open: boolean;
  message: string;
  severity: "success" | "error";
}

const productSchema = Yup.object({
  name: Yup.string().trim().required("Product name is required"),
  brand: Yup.string().trim().required("Brand is required"),
  price: Yup.number()
    .typeError("Price must be a number")
    .positive("Price must be greater than 0")
    .required("Price is required"),
  quantity: Yup.number()
    .typeError("Quantity must be a number")
    .integer("Quantity must be a whole number")
    .min(0, "Quantity can't be negative")
    .required("Quantity is required"),
});

const offerSchema = Yup.object({
  offerTitle: Yup.string().trim().required("Offer title is required"),
  discount: Yup.number()
    .typeError("Discount must be a number")
    .min(0, "Discount can't be negative")
    .max(100, "Discount can't exceed 100%")
    .required("Discount is required"),
  validUntil: Yup.date()
    .typeError("Enter a valid date")
    .min(new Date(new Date().toDateString()), "Date can't be in the past")
    .required("Valid-until date is required"),
});

const adSchema = Yup.object({
  adTitle: Yup.string().trim().required("Ad title is required"),
  targetUrl: Yup.string()
    .trim()
    .url("Enter a valid URL, e.g. https://example.com"),
});

const productInitial: ProductFormState = {
  name: "",
  brand: "",
  price: "",
  quantity: "",
};
const offerInitial: OfferFormState = {
  offerTitle: "",
  discount: "",
  validUntil: "",
  targetProduct: "",
};
const adInitial: AdFormState = { adTitle: "", placement: "", targetUrl: "" };

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}
function TabPanel({ children, value, index, ...other }: TabPanelProps) {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`shop-tabpanel-${index}`}
      aria-labelledby={`shop-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Fade in={value === index} timeout={350}>
          <Box sx={{ pt: { xs: 3, sm: 4 } }}>{children}</Box>
        </Fade>
      )}
    </div>
  );
}

function ImageUploader({
  image,
  fileName,
  onChange,
  onClear,
}: {
  image: File | null;
  fileName: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  onClear: () => void;
}) {
  const [preview, setPreview] = useState<string | null>(null);

  React.useEffect(() => {
    if (!image) {
      setPreview(null);
      return;
    }
    const url = URL.createObjectURL(image);
    setPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [image]);

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        gap: 2,
        width: "100%",
        flexWrap: "wrap",
      }}
    >
      <Button
        component="label"
        variant="outlined"
        startIcon={<CloudUploadIcon />}
        sx={{
          borderRadius: 2.5,
          textTransform: "none",
          fontWeight: 600,
          borderStyle: "dashed",
          borderWidth: 1.5,
          py: 1.1,
          px: 2.5,
          "&:hover": { borderStyle: "dashed", borderWidth: 1.5 },
        }}
      >
        Upload Image
        <input type="file" hidden accept="image/*" onChange={onChange} />
      </Button>

      {fileName && preview && (
        <Fade in>
          <Stack
            direction="row"
            spacing={1}
            sx={{
              alignItems: "center",
              bgcolor: "action.hover",
              borderRadius: 2.5,
              pl: 1,
              pr: 0.5,
              py: 0.5,
              maxWidth: "100%",
            }}
          >
            <Avatar
              src={preview}
              variant="rounded"
              sx={{ width: 32, height: 32, borderRadius: 1.5 }}
            />
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{
                maxWidth: 140,
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {fileName}
            </Typography>
            <IconButton
              size="small"
              onClick={onClear}
              aria-label="Remove image"
            >
              <CloseIcon fontSize="inherit" />
            </IconButton>
          </Stack>
        </Fade>
      )}
    </Box>
  );
}

function FormActionBar({
  loading,
  image,
  fileName,
  onImageChange,
  onImageClear,
  buttonText,
}: {
  loading: boolean;
  image: File | null;
  fileName: string;
  onImageChange: (e: ChangeEvent<HTMLInputElement>) => void;
  onImageClear: () => void;
  buttonText: string;
}) {
  return (
    <Stack
      direction={{ xs: "column", sm: "row" }}
      spacing={2}
      sx={{
        alignItems: { xs: "stretch", sm: "center" },
        justifyContent: "space-between",
        mt: { xs: 3, sm: 4 },
      }}
    >
      <ImageUploader
        image={image}
        fileName={fileName}
        onChange={onImageChange}
        onClear={onImageClear}
      />

      <Button
        type="submit"
        variant="contained"
        size="large"
        disabled={loading}
        disableElevation
        sx={{
          borderRadius: 2.5,
          textTransform: "none",
          fontWeight: 700,
          fontSize: "0.95rem",
          py: 1.2,
          width: { xs: "100%", sm: "auto" },
          minWidth: { sm: 170 },
          boxShadow: "0 4px 14px 0 rgba(0,0,0,0.15)",
        }}
      >
        {loading ? <CircularProgress size={22} color="inherit" /> : buttonText}
      </Button>
    </Stack>
  );
}

function FormikTextField({
  name,
  label,
  type = "text",
  placeholder,
  startAdornment,
  endAdornment,
  shrinkLabel,
}: {
  name: string;
  label: string;
  type?: string;
  placeholder?: string;
  startAdornment?: React.ReactNode;
  endAdornment?: React.ReactNode;
  shrinkLabel?: boolean;
}) {
  return (
    <Field name={name}>
      {({ field, meta }: FieldProps) => (
        <TextField
          {...field}
          fullWidth
          label={label}
          type={type}
          placeholder={placeholder}
          error={Boolean(meta.touched && meta.error)}
          helperText={meta.touched && meta.error ? meta.error : " "}
          sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2.5 } }}
          slotProps={{
            input: {
              startAdornment: startAdornment ? (
                <InputAdornment position="start">
                  {startAdornment}
                </InputAdornment>
              ) : undefined,
              endAdornment: endAdornment ? (
                <InputAdornment position="end">{endAdornment}</InputAdornment>
              ) : undefined,
            },
            inputLabel: shrinkLabel ? { shrink: true } : undefined,
          }}
        />
      )}
    </Field>
  );
}

type Category = "products" | "offers" | "ads";

interface BaseItem {
  id: number;
  image_url?: string | null;
  is_active: boolean;
  created_at: string;
}
interface ProductItem extends BaseItem {
  name: string;
  brand: string;
  price: number | string;
  quantity: number | string;
}
interface OfferItem extends BaseItem {
  offer_title: string;
  target_product: string;
  discount: number | string;
  valid_until: string;
}
interface AdItem extends BaseItem {
  ad_title: string;
  placement: string;
  target_url: string;
}
type AnyItem = ProductItem | OfferItem | AdItem;

const categoryConfig: Record<
  Category,
  { label: string; icon: ReactElement; singular: string }
> = {
  products: {
    label: "Products",
    icon: <Inventory2Icon fontSize="small" />,
    singular: "product",
  },
  offers: {
    label: "Offers",
    icon: <LocalOfferIcon fontSize="small" />,
    singular: "offer",
  },
  ads: {
    label: "Ads",
    icon: <CampaignIcon fontSize="small" />,
    singular: "ad",
  },
};

function getTitle(category: Category, item: AnyItem) {
  if (category === "products") return (item as ProductItem).name;
  if (category === "offers") return (item as OfferItem).offer_title;
  return (item as AdItem).ad_title;
}

function getSubtitle(category: Category, item: AnyItem) {
  if (category === "products") {
    const p = item as ProductItem;
    return `${p.brand || "—"} · Qty ${p.quantity}`;
  }
  if (category === "offers") {
    const o = item as OfferItem;
    return `For ${o.target_product || "—"} · Valid until ${formatDate(o.valid_until)}`;
  }
  const a = item as AdItem;
  return a.placement || "—";
}

function getMeta(category: Category, item: AnyItem) {
  if (category === "products") {
    const p = item as ProductItem;
    return `₹${Number(p.price).toLocaleString("en-IN")}`;
  }
  if (category === "offers") {
    const o = item as OfferItem;
    return `${o.discount}% off`;
  }
  return null;
}

function formatDate(value?: string) {
  if (!value) return "—";
  const d = new Date(value);
  if (isNaN(d.getTime())) return value;
  return d.toLocaleDateString(undefined, {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function Thumb({ src, alt }: { src?: string | null; alt: string }) {
  if (!src) {
    return (
      <Avatar
        variant="rounded"
        sx={{
          width: 56,
          height: 56,
          borderRadius: 2.5,
          bgcolor: "action.hover",
        }}
      >
        <ImageNotSupportedIcon color="disabled" fontSize="small" />
      </Avatar>
    );
  }
  return (
    <Avatar
      src={src}
      alt={alt}
      variant="rounded"
      sx={{ width: 56, height: 56, borderRadius: 2.5 }}
    />
  );
}

function StatusChip({ isActive }: { isActive: boolean }) {
  return (
    <Chip
      size="small"
      label={isActive ? "Live" : "Stopped"}
      color={isActive ? "success" : "default"}
      variant={isActive ? "filled" : "outlined"}
      sx={{ fontWeight: 700, borderRadius: 1.5, height: 24 }}
    />
  );
}

function ViewDialog({
  open,
  onClose,
  category,
  item,
}: {
  open: boolean;
  onClose: () => void;
  category: Category | null;
  item: AnyItem | null;
}) {
  if (!category || !item) return null;
  const rows: Array<[string, React.ReactNode]> = [];

  if (category === "products") {
    const p = item as ProductItem;
    rows.push(
      ["Name", p.name],
      ["Brand", p.brand],
      ["Price", `₹${p.price}`],
      ["Quantity", p.quantity],
    );
  } else if (category === "offers") {
    const o = item as OfferItem;
    rows.push(
      ["Offer title", o.offer_title],
      ["Target product", o.target_product],
      ["Discount", `${o.discount}%`],
      ["Valid until", formatDate(o.valid_until)],
    );
  } else {
    const a = item as AdItem;
    rows.push(
      ["Ad title", a.ad_title],
      ["Placement", a.placement],
      ["Target URL", a.target_url],
    );
  }
  rows.push(["Status", item.is_active ? "Live" : "Stopped"]);
  rows.push(["Created", formatDate(item.created_at)]);

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="xs">
      <DialogTitle sx={{ fontWeight: 800 }}>
        {categoryConfig[category].singular} details
      </DialogTitle>
      <DialogContent>
        <Stack spacing={2} sx={{ mt: 1 }}>
          {item.image_url && (
            <Box
              component="img"
              src={item.image_url}
              alt={getTitle(category, item)}
              sx={{
                width: "100%",
                maxHeight: 200,
                objectFit: "cover",
                borderRadius: 2.5,
              }}
            />
          )}
          <Stack spacing={1.2}>
            {rows.map(([label, value]) => (
              <Box
                key={label}
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  gap: 2,
                }}
              >
                <Typography variant="body2" color="text.secondary">
                  {label}
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    fontWeight: 600,
                    textAlign: "right",
                    wordBreak: "break-word",
                  }}
                >
                  {value as React.ReactNode}
                </Typography>
              </Box>
            ))}
          </Stack>
        </Stack>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2.5 }}>
        <Button
          onClick={onClose}
          variant="outlined"
          sx={{ borderRadius: 2.5, textTransform: "none" }}
        >
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
}

function EditDialog({
  open,
  onClose,
  category,
  item,
  onSave,
  saving,
}: {
  open: boolean;
  onClose: () => void;
  category: Category | null;
  item: AnyItem | null;
  onSave: (values: Record<string, string>) => void;
  saving: boolean;
}) {
  const [values, setValues] = useState<Record<string, string>>({});

  useEffect(() => {
    if (!item || !category) return;
    if (category === "products") {
      const p = item as ProductItem;
      setValues({
        name: p.name,
        brand: p.brand,
        price: String(p.price),
        quantity: String(p.quantity),
      });
    } else if (category === "offers") {
      const o = item as OfferItem;
      setValues({
        offerTitle: o.offer_title,
        targetProduct: o.target_product,
        discount: String(o.discount),
        validUntil: (o.valid_until || "").slice(0, 10),
      });
    } else {
      const a = item as AdItem;
      setValues({
        adTitle: a.ad_title,
        placement: a.placement,
        targetUrl: a.target_url,
      });
    }
  }, [item, category]);

  if (!category || !item) return null;

  const handleChange =
    (field: string) => (e: React.ChangeEvent<HTMLInputElement>) =>
      setValues((v) => ({ ...v, [field]: e.target.value }));

  const fieldsFor: Record<
    Category,
    Array<{ key: string; label: string; type?: string }>
  > = {
    products: [
      { key: "name", label: "Product Name" },
      { key: "brand", label: "Brand" },
      { key: "price", label: "Price", type: "number" },
      { key: "quantity", label: "Quantity", type: "number" },
    ],
    offers: [
      { key: "offerTitle", label: "Offer Title" },
      { key: "targetProduct", label: "Target Product" },
      { key: "discount", label: "Discount (%)", type: "number" },
      { key: "validUntil", label: "Valid Until", type: "date" },
    ],
    ads: [
      { key: "adTitle", label: "Ad Title" },
      { key: "placement", label: "Placement" },
      { key: "targetUrl", label: "Target URL", type: "url" },
    ],
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="xs">
      <DialogTitle sx={{ fontWeight: 800 }}>
        Update {categoryConfig[category].singular}
      </DialogTitle>
      <DialogContent>
        <Stack spacing={2.2} sx={{ mt: 1 }}>
          {fieldsFor[category].map((f) => (
            <TextField
              key={f.key}
              fullWidth
              label={f.label}
              type={f.type || "text"}
              value={values[f.key] ?? ""}
              onChange={handleChange(f.key)}
              slotProps={
                f.type === "date" ? { inputLabel: { shrink: true } } : undefined
              }
              sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2.5 } }}
            />
          ))}
        </Stack>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2.5 }}>
        <Button
          onClick={onClose}
          sx={{ borderRadius: 2.5, textTransform: "none" }}
        >
          Cancel
        </Button>
        <Button
          onClick={() => onSave(values)}
          variant="contained"
          disableElevation
          disabled={saving}
          sx={{
            borderRadius: 2.5,
            textTransform: "none",
            fontWeight: 700,
            minWidth: 110,
          }}
        >
          {saving ? (
            <CircularProgress size={20} color="inherit" />
          ) : (
            "Save changes"
          )}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

function DeleteDialog({
  open,
  onClose,
  onConfirm,
  deleting,
  label,
}: {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  deleting: boolean;
  label: string;
}) {
  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="xs">
      <DialogTitle sx={{ fontWeight: 800 }}>Delete {label}?</DialogTitle>
      <DialogContent>
        <Typography variant="body2" color="text.secondary">
          This can't be undone. The {label} will be permanently removed from
          your store.
        </Typography>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2.5 }}>
        <Button
          onClick={onClose}
          sx={{ borderRadius: 2.5, textTransform: "none" }}
        >
          Cancel
        </Button>
        <Button
          onClick={onConfirm}
          variant="contained"
          color="error"
          disableElevation
          disabled={deleting}
          sx={{
            borderRadius: 2.5,
            textTransform: "none",
            fontWeight: 700,
            minWidth: 110,
          }}
        >
          {deleting ? <CircularProgress size={20} color="inherit" /> : "Delete"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

function RowActions({
  isActive,
  onView,
  onEdit,
  onToggle,
  onDelete,
}: {
  isActive: boolean;
  onView: () => void;
  onEdit: () => void;
  onToggle: () => void;
  onDelete: () => void;
}) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const close = () => setAnchorEl(null);

  return (
    <>
      <IconButton
        size="small"
        onClick={(e) => setAnchorEl(e.currentTarget)}
        aria-label="Open actions"
        aria-controls={open ? "row-actions-menu" : undefined}
        aria-haspopup="true"
      >
        <MoreVertIcon fontSize="small" />
      </IconButton>
      <Menu
        id="row-actions-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={close}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
        slotProps={{ paper: { sx: { borderRadius: 2.5, minWidth: 190 } } }}
      >
        <MenuItem
          onClick={() => {
            close();
            onView();
          }}
        >
          <ListItemIcon>
            <VisibilityIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>View</ListItemText>
        </MenuItem>
        <MenuItem
          onClick={() => {
            close();
            onEdit();
          }}
        >
          <ListItemIcon>
            <EditIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Update</ListItemText>
        </MenuItem>
        <MenuItem
          onClick={() => {
            close();
            onToggle();
          }}
        >
          <ListItemIcon>
            {isActive ? (
              <PauseCircleOutlinedIcon fontSize="small" />
            ) : (
              <PlayCircleOutlinedIcon fontSize="small" />
            )}
          </ListItemIcon>
          <ListItemText>
            {isActive ? "Stop sharing" : "Resume sharing"}
          </ListItemText>
        </MenuItem>
        <Divider />
        <MenuItem
          onClick={() => {
            close();
            onDelete();
          }}
          sx={{ color: "error.main" }}
        >
          <ListItemIcon>
            <DeleteIcon fontSize="small" color="error" />
          </ListItemIcon>
          <ListItemText>Delete</ListItemText>
        </MenuItem>
      </Menu>
    </>
  );
}

function ShopListings() {
  const dispatch = useDispatch<AppDispatch>();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.down("md"));

  const { products, offers, ads, listLoading } = useSelector(
    (state: RootState) => state.shop,
  ) as any;

  const [category, setCategory] = useState<Category>("products");
  const [viewItem, setViewItem] = useState<AnyItem | null>(null);
  const [editItem, setEditItem] = useState<AnyItem | null>(null);
  const [deleteItem, setDeleteItem] = useState<AnyItem | null>(null);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    dispatch(fetchProducts());
    dispatch(fetchOffers());
    dispatch(fetchAds());
  }, [dispatch]);

  const dataMap: Record<Category, AnyItem[]> = {
    products: products || [],
    offers: offers || [],
    ads: ads || [],
  };

  const items = useMemo(
    () => dataMap[category] || [],
    [category, products, offers, ads],
  );

  const refetch = (cat: Category) => {
    if (cat === "products") dispatch(fetchProducts());
    if (cat === "offers") dispatch(fetchOffers());
    if (cat === "ads") dispatch(fetchAds());
  };

  const handleToggle = async (item: AnyItem) => {
    try {
      if (category === "products")
        await dispatch(
          toggleProductSharing({ id: item.id, isActive: item.is_active }),
        ).unwrap();
      if (category === "offers")
        await dispatch(
          toggleOfferSharing({ id: item.id, isActive: item.is_active }),
        ).unwrap();
      if (category === "ads")
        await dispatch(
          toggleAdSharing({ id: item.id, isActive: item.is_active }),
        ).unwrap();
      refetch(category);
    } catch (e) {
      console.error(e);
    }
  };

  const handleSaveEdit = async (values: Record<string, string>) => {
    if (!editItem) return;
    setSaving(true);
    try {
      const formData = new FormData();
      Object.entries(values).forEach(([k, v]) => formData.append(k, v));
      if (category === "products")
        await dispatch(updateProduct({ id: editItem.id, formData })).unwrap();
      if (category === "offers")
        await dispatch(updateOffer({ id: editItem.id, formData })).unwrap();
      if (category === "ads")
        await dispatch(updateAd({ id: editItem.id, formData })).unwrap();
      setEditItem(null);
      refetch(category);
    } catch (e) {
      console.error(e);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteItem) return;
    setDeleting(true);
    try {
      if (category === "products")
        await dispatch(deleteProduct(deleteItem.id)).unwrap();
      if (category === "offers")
        await dispatch(deleteOffer(deleteItem.id)).unwrap();
      if (category === "ads") await dispatch(deleteAd(deleteItem.id)).unwrap();
      setDeleteItem(null);
      refetch(category);
    } catch (e) {
      console.error(e);
    } finally {
      setDeleting(false);
    }
  };

  const loading = Boolean(listLoading);

  return (
    <Box
      sx={{
        maxWidth: 1000,
        mx: "auto",
        px: { xs: 2, sm: 3, md: 4 },
        pb: { xs: 4, md: 6 },
      }}
    >
      <Box sx={{ mb: { xs: 2.5, md: 3 } }}>
        <Typography
          variant={isMobile ? "h6" : "h5"}
          sx={{ fontWeight: 800, letterSpacing: -0.3 }}
        >
          Your listings
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Everything you've added — filter by type and manage each item.
        </Typography>
      </Box>

      <Paper
        elevation={0}
        sx={{
          borderRadius: 4,
          border: "1px solid",
          borderColor: "divider",
          boxShadow: "0 2px 24px -8px rgba(0,0,0,0.08)",
          overflow: "hidden",
        }}
      >
        <Tabs
          value={category}
          onChange={(_e, v) => setCategory(v)}
          variant="fullWidth"
          textColor="primary"
          indicatorColor="primary"
          sx={{
            minHeight: 48,
            px: 1,
            pt: 1,
            "& .MuiTab-root": {
              minHeight: 48,
              textTransform: "none",
              fontWeight: 600,
              fontSize: { xs: "0.85rem", sm: "0.95rem" },
              borderRadius: 2,
              mx: 0.5,
              gap: 0.75,
            },
            "& .MuiTabs-indicator": { height: 3, borderRadius: 3 },
          }}
        >
          {(Object.keys(categoryConfig) as Category[]).map((key) => (
            <Tab
              key={key}
              value={key}
              icon={categoryConfig[key].icon}
              iconPosition="start"
              label={
                (isMobile
                  ? undefined
                  : `${categoryConfig[key].label} (${dataMap[key]?.length ?? 0})`) as
                  | string
                  | undefined
              }
              aria-label={categoryConfig[key].label}
            />
          ))}
        </Tabs>

        <Box sx={{ p: { xs: 1.5, sm: 2.5, md: 3 } }}>
          {loading ? (
            <Stack spacing={1.5}>
              {[...Array(3)].map((_, i) => (
                <Skeleton
                  key={i}
                  variant="rounded"
                  height={isMobile ? 88 : 64}
                  sx={{ borderRadius: 2.5 }}
                />
              ))}
            </Stack>
          ) : items.length === 0 ? (
            <Box sx={{ py: 6, textAlign: "center" }}>
              <Typography variant="body2" color="text.secondary">
                No {categoryConfig[category].label.toLowerCase()} yet. Add one
                using the form above.
              </Typography>
            </Box>
          ) : isTablet ? (
            <Stack spacing={1.5}>
              {items.map((item) => (
                <Paper
                  key={item.id}
                  variant="outlined"
                  sx={{
                    p: 1.5,
                    borderRadius: 2.5,
                    display: "flex",
                    alignItems: "center",
                    gap: 1.5,
                  }}
                >
                  <Thumb src={item.image_url} alt={getTitle(category, item)} />
                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Stack
                      direction="row"
                      spacing={1}
                      sx={{ alignItems: "center", mb: 0.25 }}
                    >
                      <Typography
                        variant="subtitle2"
                        sx={{
                          fontWeight: 700,
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {getTitle(category, item)}
                      </Typography>
                      <StatusChip isActive={item.is_active} />
                    </Stack>
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      sx={{ display: "block" }}
                    >
                      {getSubtitle(category, item)}
                    </Typography>
                    {getMeta(category, item) && (
                      <Typography
                        variant="caption"
                        sx={{ fontWeight: 700, color: "text.primary" }}
                      >
                        {getMeta(category, item)}
                      </Typography>
                    )}
                  </Box>
                  <RowActions
                    isActive={item.is_active}
                    onView={() => setViewItem(item)}
                    onEdit={() => setEditItem(item)}
                    onToggle={() => handleToggle(item)}
                    onDelete={() => setDeleteItem(item)}
                  />
                </Paper>
              ))}
            </Stack>
          ) : (
            <TableContainer>
              <Table size="medium">
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 700 }}>
                      {categoryConfig[category].singular}
                    </TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Details</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Status</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Added</TableCell>
                    <TableCell align="right" sx={{ fontWeight: 700 }}>
                      Actions
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {items.map((item) => (
                    <TableRow key={item.id} hover>
                      <TableCell>
                        <Stack
                          direction="row"
                          spacing={1.5}
                          sx={{ alignItems: "center" }}
                        >
                          <Thumb
                            src={item.image_url}
                            alt={getTitle(category, item)}
                          />
                          <Box sx={{ minWidth: 0 }}>
                            <Typography
                              variant="body2"
                              sx={{ fontWeight: 700 }}
                            >
                              {getTitle(category, item)}
                            </Typography>
                            {getMeta(category, item) && (
                              <Typography
                                variant="caption"
                                color="text.secondary"
                              >
                                {getMeta(category, item)}
                              </Typography>
                            )}
                          </Box>
                        </Stack>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" color="text.secondary">
                          {getSubtitle(category, item)}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <StatusChip isActive={item.is_active} />
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" color="text.secondary">
                          {formatDate(item.created_at)}
                        </Typography>
                      </TableCell>
                      <TableCell align="right">
                        <RowActions
                          isActive={item.is_active}
                          onView={() => setViewItem(item)}
                          onEdit={() => setEditItem(item)}
                          onToggle={() => handleToggle(item)}
                          onDelete={() => setDeleteItem(item)}
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </Box>
      </Paper>

      <ViewDialog
        open={Boolean(viewItem)}
        onClose={() => setViewItem(null)}
        category={category}
        item={viewItem}
      />
      <EditDialog
        open={Boolean(editItem)}
        onClose={() => setEditItem(null)}
        category={category}
        item={editItem}
        onSave={handleSaveEdit}
        saving={saving}
      />
      <DeleteDialog
        open={Boolean(deleteItem)}
        onClose={() => setDeleteItem(null)}
        onConfirm={handleDelete}
        deleting={deleting}
        label={category ? categoryConfig[category].singular : "item"}
      />
    </Box>
  );
}

const AddProduct = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { loading } = useSelector((state: RootState) => state.shop);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const [tabIndex, setTabIndex] = useState(0);
  const [image, setImage] = useState<File | null>(null);
  const [fileName, setFileName] = useState<string>("");
  const [snack, setSnack] = useState<SnackState>({
    open: false,
    message: "",
    severity: "success",
  });

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabIndex(newValue);
    setImage(null);
    setFileName("");
  };

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImage(e.target.files[0]);
      setFileName(e.target.files[0].name);
    }
  };

  const handleImageClear = () => {
    setImage(null);
    setFileName("");
  };

  const showSuccess = (message: string) =>
    setSnack({ open: true, message, severity: "success" });
  const showError = (message: string) =>
    setSnack({ open: true, message, severity: "error" });
  const closeSnack = () => setSnack((s) => ({ ...s, open: false }));

  const buildFormData = (
    values: ProductFormState | OfferFormState | AdFormState,
  ) => {
    const formData = new FormData();
    if (image) formData.append("image", image);
    Object.entries(values).forEach(([key, value]) =>
      formData.append(key, String(value)),
    );
    return formData;
  };

  const submitProduct = async (
    values: ProductFormState,
    helpers: { resetForm: () => void; setSubmitting: (v: boolean) => void },
  ) => {
    try {
      const formData = buildFormData(values);
      const result = await dispatch(
        addProduct({ formData, itemData: values }),
      ).unwrap();
      showSuccess((result as any)?.message || "Product added successfully");
      helpers.resetForm();
      handleImageClear();
    } catch (error: any) {
      showError(error?.message || "Failed to save product. Please try again.");
    } finally {
      helpers.setSubmitting(false);
    }
  };

  const submitOffer = async (
    values: OfferFormState,
    helpers: { resetForm: () => void; setSubmitting: (v: boolean) => void },
  ) => {
    try {
      const formData = buildFormData(values);
      const result = await dispatch(
        addOffer({ formData, itemData: values }),
      ).unwrap();
      showSuccess((result as any)?.message || "Offer created successfully");
      helpers.resetForm();
      handleImageClear();
    } catch (error: any) {
      showError(error?.message || "Failed to save offer. Please try again.");
    } finally {
      helpers.setSubmitting(false);
    }
  };

  const submitAd = async (
    values: AdFormState,
    helpers: { resetForm: () => void; setSubmitting: (v: boolean) => void },
  ) => {
    try {
      const formData = buildFormData(values);
      const result = await dispatch(
        addAd({ formData, itemData: values }),
      ).unwrap();
      showSuccess(
        (result as any)?.message || "Ad campaign started successfully",
      );
      helpers.resetForm();
      handleImageClear();
    } catch (error: any) {
      showError(error?.message || "Failed to launch ad. Please try again.");
    } finally {
      helpers.setSubmitting(false);
    }
  };

  const tabConfig = [
    { label: "Product", icon: <Inventory2Icon fontSize="small" /> },
    { label: "Offer", icon: <LocalOfferIcon fontSize="small" /> },
    { label: "Ad", icon: <CampaignIcon fontSize="small" /> },
  ];

  return (
    <Box
      sx={{
        maxWidth: 820,
        mx: "auto",
        px: { xs: 2, sm: 3, md: 4 },
        py: { xs: 3, md: 5 },
      }}
    >
      <Box sx={{ mb: { xs: 3, md: 4 } }}>
        <Typography
          variant={isMobile ? "h5" : "h4"}
          gutterBottom
          sx={{ fontWeight: 800, letterSpacing: -0.5 }}
        >
          Shop Management
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Add new products, promotional offers, and ad campaigns to your store.
        </Typography>
      </Box>

      <Paper
        elevation={0}
        sx={{
          p: { xs: 2, sm: 3, md: 4 },
          borderRadius: 4,
          border: "1px solid",
          borderColor: "divider",
          boxShadow: "0 2px 24px -8px rgba(0,0,0,0.08)",
        }}
      >
        <Tabs
          value={tabIndex}
          onChange={handleTabChange}
          variant="fullWidth"
          textColor="primary"
          indicatorColor="primary"
          sx={{
            minHeight: 48,
            "& .MuiTab-root": {
              minHeight: 48,
              textTransform: "none",
              fontWeight: 600,
              fontSize: { xs: "0.85rem", sm: "0.95rem" },
              borderRadius: 2,
              mx: 0.5,
              gap: 0.75,
            },
            "& .MuiTabs-indicator": { height: 3, borderRadius: 3 },
          }}
        >
          {tabConfig.map((tab, i) => (
            <Tab
              key={tab.label}
              icon={tab.icon}
              iconPosition="start"
              label={isMobile ? undefined : tab.label}
              aria-label={tab.label}
              id={`shop-tab-${i}`}
              aria-controls={`shop-tabpanel-${i}`}
            />
          ))}
        </Tabs>

        <TabPanel value={tabIndex} index={0}>
          <Formik
            initialValues={productInitial}
            validationSchema={productSchema}
            onSubmit={submitProduct}
          >
            {({ isSubmitting }) => (
              <Form noValidate>
                <Grid container spacing={2.5}>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <FormikTextField name="name" label="Product Name" />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <FormikTextField name="brand" label="Brand" />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <FormikTextField
                      name="price"
                      label="Price"
                      type="number"
                      startAdornment={
                        <CurrencyRupeeIcon fontSize="small" color="action" />
                      }
                    />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <FormikTextField
                      name="quantity"
                      label="Quantity"
                      type="number"
                    />
                  </Grid>
                </Grid>
                <FormActionBar
                  loading={loading || isSubmitting}
                  image={image}
                  fileName={fileName}
                  onImageChange={handleImageChange}
                  onImageClear={handleImageClear}
                  buttonText="Save Product"
                />
              </Form>
            )}
          </Formik>
        </TabPanel>

        <TabPanel value={tabIndex} index={1}>
          <Formik
            initialValues={offerInitial}
            validationSchema={offerSchema}
            onSubmit={submitOffer}
          >
            {({ isSubmitting }) => (
              <Form noValidate>
                <Grid container spacing={2.5}>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <FormikTextField name="offerTitle" label="Offer Title" />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <FormikTextField
                      name="targetProduct"
                      label="Target Product"
                    />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <FormikTextField
                      name="discount"
                      label="Discount"
                      type="number"
                      endAdornment="%"
                    />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <FormikTextField
                      name="validUntil"
                      label="Valid Until"
                      type="date"
                      shrinkLabel
                    />
                  </Grid>
                </Grid>
                <FormActionBar
                  loading={loading || isSubmitting}
                  image={image}
                  fileName={fileName}
                  onImageChange={handleImageChange}
                  onImageClear={handleImageClear}
                  buttonText="Save Offer"
                />
              </Form>
            )}
          </Formik>
        </TabPanel>

        <TabPanel value={tabIndex} index={2}>
          <Formik
            initialValues={adInitial}
            validationSchema={adSchema}
            onSubmit={submitAd}
          >
            {({ isSubmitting }) => (
              <Form noValidate>
                <Stack spacing={2.5}>
                  <FormikTextField name="adTitle" label="Ad Title" />
                  <FormikTextField
                    name="placement"
                    label="Placement"
                    placeholder="e.g. Homepage Banner"
                  />
                  <FormikTextField
                    name="targetUrl"
                    label="Target URL"
                    type="url"
                    placeholder="https://example.com"
                    startAdornment={
                      <LinkIcon fontSize="small" color="action" />
                    }
                  />
                </Stack>
                <FormActionBar
                  loading={loading || isSubmitting}
                  image={image}
                  fileName={fileName}
                  onImageChange={handleImageChange}
                  onImageClear={handleImageClear}
                  buttonText="Launch Ad"
                />
              </Form>
            )}
          </Formik>
        </TabPanel>
      </Paper>

      <Box sx={{ mt: { xs: 4, md: 6 } }}>
        <ShopListings />
      </Box>

      <Snackbar
        open={snack.open}
        autoHideDuration={4000}
        onClose={closeSnack}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={closeSnack}
          severity={snack.severity}
          variant="filled"
          sx={{ borderRadius: 2.5, width: "100%" }}
        >
          {snack.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default AddProduct;
